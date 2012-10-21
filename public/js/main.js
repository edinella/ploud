$(function(){

	// main navigation
	$("#sections").tabs({
		"show":300,
		"activate":function(event, ui){
			$.Storage.saveItem('navtab', ui.newPanel.attr('id'));
			}
		});
	$('ul#nav')
		.css('width', $.Storage.loadItem('navsize'))
		.resizable({
			"minWidth":150,
			"maxWidth":700,
			"handles":"e",
			"stop":function(){
				$.Storage.saveItem('navsize', $(this).width());
				}
			});
	var lastTab = $.Storage.loadItem('navtab');
	if(lastTab)
		$('a[href="#'+lastTab+'"]').trigger('click');

	// sortables
    $("ul.section").sortable({
    	"revert":true,
    	"items":"li:not(.empty)"
    	});

    // droppables
	// $("ul.sections_nav li.droppable a").droppable({
	// 	"tolerance":"pointer",
	// 	"accept":"ul.sortable li",
	// 	"drop":function(event, ui){
	// 		$(this).effect('highlight');//.trigger('click');
	// 		//var listaDestino = destinationTab.find();
			
	// 		}
	// 	});

	// handle uploads
	$('#arriving').hide();
	$(document).filedrop({
		"url":"/library",
		"paramname":"musica",
		"maxfilesize":20,
		"allowedfiletypes":['audio/webm','audio/ogg','audio/mpeg','audio/mp3'],
	    "uploadFinished":function(i,file,response){
			$('#inbox').removeClass('ocupado');
			update();
			},
		"drop":function(){
			$('#inbox').addClass('ocupado');
			},
		"rename":function(nome){
			return escape(nome);
			},
		"docOver":function(){
			$('#arriving').fadeIn();
			},
		"docLeave":function(){
			$('#arriving').fadeOut();
			},
		"error":function(err, file){}
		});

	// loads library
	var updating;
	var library = [];
	var lastLibEtag = '';
	function update(){
		clearInterval(updating);
		loadsLibrary();
		updating = setInterval(loadsLibrary, 3000);
		}
	function loadsLibrary(){
		var jqXHR = $.getJSON('/library/library.json', function(data){
			var libEtag = jqXHR.getResponseHeader('Etag');
			if(libEtag != lastLibEtag)
				{
				library = data;
				updateList('library', library);
				}
	        lastLibEtag = libEtag;
			});
		}
	function updateList(listAlias, listSongs){
		var list = $('ul#'+listAlias);
		if(listSongs.length)
			list.html(listSongs.map(function(song){
				return '<li id="song_'+song.timeAdded+'">'
						+'<span class="picture"><img src="/library/'+song.picture+'" /></span>'
						+'<span class="play">▸</span>'
						+'<span class="title">'+song.title+'</span>'
						+'<span class="artist">'+song.artist.join(', ')+'</span>'
						+'<span class="genre">'+song.genre.join(', ')+'</span>'
						+'<span class="album">'+song.album+'</span>'
						+'<span class="year">'+song.year+'</span>'
					+'</li>';
				}).join(''));
		else
			{
			list.html('<li class="empty">add songs here</li>');
			size();
			}
		}
	$('ul.section').each(function(){
		updateList(this.id, []);
		});
	update();
	function getSong(time){
		for(var i=0,l=library.length;i<l;i++)
			if(library[i].timeAdded == time)
				return library[i];
		}

	// lists events
	$('ul.section li, ul.section span.play').live('mouseenter', function(){
		$(this).addClass('over');
		});
	$('ul.section li, ul.section span.play').live('mouseleave', function(){
		$(this).removeClass('over');
		});
	$('ul.section span.play').live('click', function(){
		play($(this).closest('li').attr('id').replace('song_',''));
		});

	// view switches
	var vbts = $('ul.views button');
	var allViewClasses = [];
	vbts.each(function(){
		allViewClasses.push(this.className);
		});
	allViewClasses = allViewClasses.join(' ');
	vbts.click(function(){
		var sectionId = $('ul.section:visible').removeClass(allViewClasses).addClass(this.className).attr('id');
		$.Storage.saveItem(sectionId+'_view', this.className);
		});
	$('ul.section').each(function(){
		var view = $.Storage.loadItem(this.id+'_view');
		if(view)
			$(this).addClass(view);
		else
			vbts.filter(':first').trigger('click');
		});

	// setup the player
	var audio = false;
	function play(id){
		$('#player').animate({"height":playerHeight});
		$('li.current').removeClass('current');
		$('#song_'+id).addClass('current');
		var song = getSong(id);
		if(audio === false)
			audio = a[0];
		audio.load('/library/'+song.fileName);
		audio.play();
		}
	function playNext(){
		var current = $('li.current');
		var next = current.next();
		if(!next.length)
			next = current.siblings('li').first();
		play(next.get(0).id.replace('song_', ''));
		}
    var a = audiojs.createAll({
		"trackEnded":playNext
		});

    // key bindings
	$(document).keydown(function(e){
		if(audio === false)
			return;

		var unicode = e.charCode
			? e.charCode
			: e.keyCode;

		// right arrow
		if(unicode == 39)
			playNext();
		
		// left arrow
		//else if(unicode == 37)
		
		// spacebar
		else if(unicode == 32)
			audio.playPause();
		});

	// handle resize
	function size(){
		var total = $("html").height();
		var header = $("#header").height();
		var player = $("#player").height();
		var avaliable = total - header - player;
	    $("#sections").height(avaliable);
	    $("#arriving").css('line-height', total+'px');
	    $("li.empty").css('line-height', avaliable+'px');
	    $("#player .scrubber").width($("html").width() - 200);
		}
	$(window).resize(size);
	var playerHeight = $('#player').height();
	$('#player').height(0);
	size();
	});