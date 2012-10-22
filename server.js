
// dependencies
var express = require('express');
var config = require('./config');
var library = require('./library');

// app
var app = express();
var bp = express.bodyParser({"uploadDir":config.uploadsDir});
app.use(app.router);
app.use(express.static(config.publicDir));

// adds song to library
app.post('/library', bp, function(req, res){
	library.add(
		req.files.musica.path,
		req.files.musica.name,
		function(){
			res.status(200);
			res.end('OK');
			}
		);
	});

// starts app
app.listen(config.port);