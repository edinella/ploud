
// dependencies
var fs = require('fs');
var mmd = require('musicmetadata');

// paths
var libraryPath = process.env.npm_package_config_librarypath;
var libraryFile = libraryPath+'/library.json';

// obtains persisted library object, if exists
var library = fs.existsSync(libraryFile)
	? JSON.parse(fs.readFileSync(libraryFile))
	: [];

/**
 * Persists library object
 * @param  {object} library Library object
 */
function save(){
	fs.writeFile(libraryFile, JSON.stringify(library));
	}


/**
 * Obtains library object
 */
exports.get = function get(){
	return library;
	}

/**
 * Adds song to library
 * @param {string} tempFile Temporary filepath
 * @param {string} tempName Original filename
 * @param {function} done Callback
 */
exports.add = function addSong(tempFile, tempName, done){

	// prepare item info
	var time = new Date().getTime();
	var originalFilename = unescape(tempName);
	var ext = originalFilename.split('.').pop();
	var fileName = time+'.'+ext;
	var newPath = libraryPath+'/'+fileName;
	var pictureName = time+'.png';
	var picturePath = libraryPath+'/'+pictureName;

	// move temp file to library dir
	fs.rename(tempFile, newPath, function RenamingNewSongFile(err){

		// if an error happened while moving, remove temporary file
		if(err){
			fs.unlink(tempFile);
			console.log('x '+originalFilename);
			}

		// if moved, obtains metadata, update and persists library json
		else{
			var stream = fs.createReadStream(newPath);
			var parser = new mmd(stream);
			var info = {
				"title":originalFilename,
				"timeAdded":time,
				"fileName":fileName,
				"originalFilename":originalFilename,
				"picture":""
				};
			parser.on('title', function(v){
				if(v != '')
					info.title = v;
				});
			parser.on('artist', function(v){
				info.artist = v;
				});
			parser.on('album', function(v){
				info.album = v;
				});
			parser.on('year', function(v){
				info.year = v;
				});
			parser.on('genre', function(v){
				info.genre = v;
				});
			parser.on('picture', function(v){
				if(typeof v[0] != 'undefined' && typeof v[0].data != 'undefined'){
					var binaryData = new Buffer(v[0].data, 'base64').toString('binary');
					fs.writeFile(picturePath, binaryData, "binary", function(err){});
					info.picture = pictureName;
					}
				});
			parser.on('done', function(err){
				// if(err)
				// 	throw err;
				library.push(info);
				save();
				console.log('+ '+originalFilename);
				stream.destroy();
				done();
				});
			}
		});
	};