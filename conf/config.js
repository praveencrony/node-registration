'use strict';

require('dotenv').config({
  path: __dirname + '/../.env'
});

var config = function()
{  
    switch(process.env.APP_ENV) 
    {
      
        case 'development':
          return {

                'mail': {
                  'from': '',
                  'to': ''
                }
            };
          break;

        case 'staging':
          return {
            
                'mail': {
                  'from': '',
                  'to': '',
                  'smtp':{
                    'host': '',
                    'user': '',
                    'password': ''
                  }
                }
            };
        break;

        case 'testing':
          return {
            
                'mail': {
                  'from': '',
                  'to': '',
                  'smtp':{
                    'host': '',
                    'user': '',
                    'password': ''
                  }
                }
            };

        break;

        case 'production':
          return {
            
                'mail': {
                  'from': '',
                  'to': '',
                  'smtp':{
                    'host': '',
                    'user': '',
                    'password': ''
                  }
                }
            };
    }
       
 

};


module.exports = new config();