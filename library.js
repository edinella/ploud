
// dependencies
var fs = require('fs');
var config = require('./config');
var mmd = require('musicmetadata');

// obtains persisted library object, if exists
var library = fs.existsSync(config.libraryFile)
	? JSON.parse(fs.readFileSync(config.libraryFile))
	: [];

/**
 * Persists library object
 * @param  {object} library Library object
 */
function save(){
	fs.writeFile(config.libraryFile, JSON.stringify(library));
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
	var newPath = config.libraryDir+'/'+fileName;
	var pictureName = time+'.png';
	var picturePath = config.libraryDir+'/'+pictureName;

	// move temp file to library dir
	fs.rename(tempFile, newPath, function RenamingNewSongFile(err){

		// if an error happened while moving, remove temporary file
		if(err)
			{
			fs.unlink(tempFile);
			console.log('x '+originalFilename);
			}

		// if moved, obtains metadata, update and persists library json
		else
			{
			var stream = fs.createReadStream(newPath);
			var parser = new mmd(stream);
			parser.on('metadata', function(info){
				info.timeAdded = time;
				info.fileName = fileName;
				info.originalFilename = originalFilename;
				if(typeof info.picture != 'undefined' && typeof info.picture[0] != 'undefined' && typeof info.picture[0].data != 'undefined')
					{
					var binaryData = new Buffer(info.picture[0].data, 'base64').toString('binary');
					fs.writeFile(picturePath, binaryData, "binary", function(err){});
					info.picture = pictureName;
					}
				else
					info.picture = '';
				library.push(info);
				save();
				console.log('+ '+originalFilename);
				});
			parser.on('done', function(err){
				if(err)
					throw err;
				stream.destroy();
				done();
				});
			}
		});
	};