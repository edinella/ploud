
// dependencies
var express = require('express');
var library = require('./library');

// app
var app = express();
var bp = express.bodyParser();
app.use(app.router);
app.use(express.static(__dirname+'/public'));

// adds song to library
app.post('/library', bp, function(req, res){
	library.add(
		req.files.musica.path,
		req.files.musica.name,
		function(){
			res.send(200, 'OK');
			}
		);
	});

// get library
app.get('/library', function(req, res){
	res.send(200, library.get());
	});

// starts app
app.listen(process.env.npm_package_config_port);