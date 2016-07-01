'use strict';

require('dotenv').config({path: __dirname + '/.env'}); // require env

const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const device          = require('express-device');
const i18n            = require('./lib/i18n');
const logger          = require('./lib/logger');
const app             = express();


const environment = process.env.APP_ENV || 'development';
logger.log('verbose', `Running on environment ${environment} from directory ${__dirname}`);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Route Middlewares

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(device.capture());

//For Mobile Detect
device.enableDeviceHelpers(app);
device.enableViewRouting(app);

// set public path
app.use('/assets',express.static(path.join(__dirname, 'public')));
app.use(i18n);

// Define routes
const routes        = require('./routes/index');
const labels        = require('./routes/labels');

//Route Mounts
app.use('/', routes);
app.use('/labels', labels);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

const server      = require('http').Server(app);
const serverIp    = process.env.APP_IP || '0.0.0.0';
const serverPort  = process.env.APP_PORT || 20310;

logger.log('info', `Listening on ${serverIp}:${serverPort}`);

server.listen(serverPort, serverIp);

module.exports = app;
