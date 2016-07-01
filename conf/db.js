'use strict';

const mysql  	= require('mysql');

const dbconn 	= mysql.createPool(
{
	connectionLimit: 100,
	host     : process.env.DB_SERVER,
	user     : process.env.DB_USER,
	password : process.env.DB_PASSWD,
	database : process.env.DB_NAME
	//debug		:true
});


module.exports = dbconn;