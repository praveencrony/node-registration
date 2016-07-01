var i18n = require('i18n');

//i18n
i18n.configure({
  locales: 'en_US',
  directory: process.cwd()+ '/locales',
  defaultLocale: 'en_US',
  updateFiles: false,
});

module.exports = function(req, res, next) 
{

  i18n.init(req, res);
  //res.locals('__', res.__);

  var current_locale = i18n.getLocale();

  return next();
};