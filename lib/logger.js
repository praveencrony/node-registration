const winston = require('winston');

const environment = process.env.APP_ENV || 'development';

module.exports = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: true,
			level: environment === 'production' ? 'info': 'silly'
		}),
	]
});
