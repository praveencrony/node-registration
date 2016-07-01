'use strict';

const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
const nodemailer 	= require('nodemailer');
const promise 		= require('bluebird');
const i18n        	= require("i18n");
const logger 		= require('../lib/logger');
const db 			= require('../conf/db'); //mysql db conn
const conf 			= require('../conf/config'); // General Config

// SMTP Config
var transporter;

if(process.env.APP_ENV === 'development')
{
	transporter = nodemailer.createTransport('direct',
	{
		debug:true
	});
}
else
{
	transporter = nodemailer.createTransport('SMTP',
	{
		host:conf.mail.smtp.host,
		port:465,
		secure:true,
		auth:{
			user:conf.mail.smtp.user,
			pass:conf.mail.smtp.password
		}
		
	});
}

//Email Exist

var isEmailExist	=	function(mobile)
{
	return new promise(function (resolve, reject)
	{
		db.getConnection(function(err,connection)
		{
		 	if(err)
		 	{
		 		reject({text:'', error:1});
		 		logger.error(err);
		 		return;
		 	}

		 	db.query('SELECT mobile FROM vw_users WHERE mobile = ?', mobile, function(err, result)
			{
				if(result.length !== 0)
					reject({text:i18n.__('mobile_already_exist'), error:1});
				else
					resolve(result);
			});

			connection.release();
		});
	});

};


// Save Users
var saveUsers	=	function(data)
{
	return new promise(function (resolve, reject)
	{
		db.getConnection(function(err,connection)
		{
		 	if(err)
		 	{
		 		reject({text:'', error:1});
		 		logger.error(err);
		 		return;
		 	}
		   
			db.query('INSERT INTO vw_users SET ?', data, function(err,ret)
			{
				if(err)
					reject({text:i18n.__('error_save_form'), error:1});
				else
					resolve(ret);
			});

			connection.release();
			
		});
	});
};

// Send Mail
var sendEmail = function(formData)
{
	var htmltemp	=	'<table><tr><td>Name</td>\
						<td>'+formData.name+'</td></tr>\
						<tr><td>Email</td><td>'+formData.mobile+'</td></tr>\
						<tr><td>Photo</td><td><img src="'+formData.location+'"></td></tr>\
						</table>';
	var mailOptions = {
						from 	: 	conf.mail.from, 
					    to 		: 	conf.mail.to, 
					    subject : 	i18n.__('mail_subject'), 
					    html 	: 	htmltemp
					};

	transporter.sendMail(mailOptions, function(err,info)
	{
		if(err)
		{
			logger.error(err);
			return false;
		}
		else
			return true;
	});

	transporter.close();
};


//Routes
router.get('/', function(req, res, next) {
	//res.locals
  res.render('index', { title: i18n.__('app_title') });
});

// Form Submit
router.post('/driveform', function(req, res, next) 
{
	if(! req.body )
		return res.json({'text':i18n.__('invalid_request'), 'error': 1});

	else if(! req.body.name )
		return res.json({'text':i18n.__('name_error_msg'), 'error': 1});

	else if(! req.body.mobile )
		return res.json({'text':i18n.__('mobile_empty'), 'error': 1});

	else if(! req.body.location )
		return res.json({'text':i18n.__('location_error_msg'), 'error': 1});

	var formData	=	req.body;

	formData.ua					=	req.headers['user-agent'];
	formData.date_registered	=	Date.now();
	formData.ip					=	req.ip;

	isEmailExist(formData.mobile).then(function(data)
	{
		return saveUsers(formData).then(function(data)
		{
			try{
				sendEmail(formData);
			}
			catch(e){
				console.log(e.message);
			}

			res.json({'text':i18n.__('success_msg'), 'error': 0});
		})
		
	})
	.catch (function(error)
	{
		res.json(error);
	});
});


module.exports = router;
