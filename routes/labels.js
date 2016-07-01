'use strict';

const express		= 	require('express');
const router 		= 	express.Router();
const bodyParser 	= 	require('body-parser');
const path  		= 	require('path');
const fs 			= 	require("fs");
const db 			= 	require('../conf/db');
	
	router.get('/', function(req, res, next) 
	{
		var label_list = {};

		db.getConnection(function(err,connection)
		{
			try{
				if(err)
		 	  		throw err;
			}
			catch(e){
				console.log(e);
				return;
			}
		 	
		 	db.query('SELECT * FROM i18n_locales WHERE is_enabled = 1 LIMIT 1', function(err, result)
			{
				try{
					if(err)
			 	  		throw err;
				}
				catch(e){
					console.log(e);
					return;
				}

				var enabled_locale	= result[0].locale;
    			var localesQuery 	= 'SELECT id_label,'+enabled_locale+'  FROM i18n_locales_labels';

    
	    		db.query(localesQuery, function(err, labels, fields) 
	    		{
	        		try{
						if(err)
				 	  		throw err;
					}
					catch(e){
						console.log(e);
						return;
					}

		        for(var n in labels) {

		            var locale_name = labels[n].id_label, label_name=labels[n][enabled_locale];

		            label_list[locale_name] = label_name;
		        }

		       fs.writeFile(process.cwd()+'/locales/'+enabled_locale+'.json', JSON.stringify(label_list), function (err) {
		          try{
					if(err)
			 	  		throw err;
				}
				catch(e){
					console.log(e);
					return;
				}
		          console.log('Saved!');
		        });
	    
	   		 	});

				connection.release();
			});
			
		});
	  
	});


module.exports = router;
