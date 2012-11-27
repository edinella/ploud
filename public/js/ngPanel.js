
// module
angular.module('ngPanel', ['ngResource']);

// main controller
function PanelController($scope, $location, $resource, $locale){

	// nav
	$scope.path = '';
	$scope.$watch(function(){return $location.path();}, function(newPath){
		$scope.path = newPath;
		});
	$scope.isActive = function(path){
		return path === $scope.path;
		}

	// songs
	$scope.viewstyle = $.Storage.loadItem('viewstyle') || 'list';
	$scope.favorites = $.Storage.loadItem('favorites') || [];
	$scope.songs = $resource('/library/:songId').query(function(){
		$scope.songs = $scope.songs.map(function(song){
			song.favorite = $scope.favorites.some(function(favTimeAdded){
				return song.timeAdded == favTimeAdded;
				});
			return song;
			});
		});
	$scope.$watch('viewstyle', function(){
		$.Storage.saveItem('viewstyle', $scope.viewstyle);
		});
	$scope.sortBy = function(col){
		if($scope.sort == col)
			$scope.reverse = !$scope.reverse;
		$scope.sort = col;
		}
	$scope.setFavorite = function(song, isFavorite){
		if(typeof isFavorite == 'undefined')
			isFavorite = !song.favorite;
		song.favorite = isFavorite;
		$scope.favorites = $scope.songs.filter(function(song){return song.favorite}).map(function(song){return song.timeAdded});
		$.Storage.saveItem('favorites', $scope.favorites);
		};
	$scope.filterFavorites = function(song){
		return $scope.path == '/favorites'
			? $scope.favorites.some(function(favTimeAdded){return song.timeAdded == favTimeAdded})
			: true;
		};
	$scope.selectedSongs = function(){
		return $scope.songs.filter(function(song){return !!song.selected;});
		};
	$scope.selectionSize = function(){
		return $scope.selectedSongs().length;
		};
	$scope.selectionClear = function(){
		$scope.songs = $scope.songs.map(function(song){
			song.selected = false;
			return song;
			});
		};
	$scope.selectionAddFavorites = function(){
		var songs = $scope.selectedSongs();
		for(i in songs)
			$scope.setFavorite(songs[i], true);
		};

	// language
	if($locale.id == 'en-us'){
		$scope.selectedSongForms = {
			0: 'no songs',
			one: '{} song',
			other: '{} songs'
			};
		}
	}