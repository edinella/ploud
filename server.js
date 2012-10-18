
// dependencies
var express = require('express');
var config = require('./config');
var library = require('./library');

// app
var app = express();
app.use(express.bodyParser({"uploadDir":config.uploadsDir}));
app.use(app.router);
app.use(express.static(config.publicDir));

// adds song to library
app.post('/library', function(req, res){
	library.add(
		req.files.musica.path,
		req.files.musica.name
		);
	});

// starts app
app.listen(config.port);