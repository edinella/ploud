
// dependencies
var fs = require('fs');
var config = require('./config');

// obtains persisted library object, if exists
var library = fs.existsSync(config.libraryFile)
	? JSON.parse(fs.readFileSync(config.libraryFile))
	: {};

/**
 * Persists library object
 * @param  {object} library Library object
 */
function save(library){
	fs.writeFile(config.libraryFile, JSON.stringify(library));
	}

/**
 * Adds song to library
 * @param {string} tempFile Temporary filepath
 * @param {string} tempName Original filename
 */
exports.add = function addSong(tempFile, tempName){

	// prepare item info
	var name = unescape(tempName);
	var time = new Date().getTime();
	var ext = name.split('.').pop();
	var newPath = config.libraryDir+'/'+time+'.'+ext;

	// move temp file to library dir
	fs.rename(tempFile, newPath, function RenamingNewSongFile(err){

		// if an error happened while moving, remove temporary file
		if(err)
			{
			fs.unlink(tempFile);
			console.log('x '+name);
			}

		// if moved, update and persists library json
		else
			{
			library[time] = {
				"name":name,
				"time":time
				};
			save(library);
			console.log('+ '+name);
			}
		});
	};