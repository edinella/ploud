
// requer dependencias
var express = require('express');
var fs = require('fs');

// prepara ambiente
var ultima = '';
var playlist = [];
var dirPublic = __dirname+'/public';
var dirUploads = __dirname+'/uploads';
var dirPlaylist = dirPublic+'/playlist';
var filePlaylist = dirPlaylist+'/playlist.json';

// app
var app = express();
app.use(express.bodyParser({"uploadDir":dirUploads}));
app.use(app.router);
app.use(express.static(dirPublic));

// lembra da ultima musica tocada
app.get('/playlist/:musica', function(req, res, next){
	var musica = req.params.musica.split('.').shift();
	if(musica != 'playlist')
		{
		ultima = musica;
		console.log('> '+req.params.musica);
		}
	next();
	});
app.get('/ultima', function(req, res){
	res.send(200, ultima);
	});

// recebe musicas novas
app.post('/playlist', function(req, res){
	var nome = unescape(req.files.musica.name);
	var path = req.files.musica.path;
	var time = new Date().getTime();
	var ext = nome.split('.').pop();

	// evita duplicidade, removendo o temporário que chegou
	if(playlist.some(function(musica){return musica.nome == nome}))
		fs.unlink(path, function(err){
			console.log('= '+nome);
			res.send(200, '=');
			});

	// acrescenta à pasta de musicas e à playlist
    else
    	fs.rename(path, dirPlaylist+'/'+time+'.'+ext, function(err){
    		playlist.push({
				"nome":nome,
				"rank":0,
				"time":time
				});
    		rankeiaPlaylist();
			console.log('+ '+nome);
			res.send(200, '+');
			});
	});

// vai filhão!
app.listen(3000);

// ordena músicas da playlist e armazena em arquivo
function rankeiaPlaylist(){
	playlist = playlist.sort(function(a, b){
		return a.rank < b.rank || (a.rank == b.rank && a.time > b.time);
		});
	fs.writeFile(filePlaylist, JSON.stringify(playlist));
	}

// carrega playlist antiga
if(fs.existsSync(filePlaylist))
	playlist = JSON.parse(fs.readFileSync(filePlaylist));