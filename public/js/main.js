function size(){
    $("#sections").css("height", $("html").height()-$("#header").height()+"px");
	}

$(function(){

	// handle resize
	$(window).resize(size);
	size();

	// sortables and droppables
    $("ul.sortable").sortable({revert:true});
	$("#sections").tabs();
	$("ul.sections_nav li.droppable a").droppable({
		tolerance:"pointer",
		accept:"ul.sortable li",
		drop:function(event, ui){
			$(this).effect('highlight');//.trigger('click');
			//var listaDestino = destinationTab.find();
			
			}
		});

	// handle uploads
	$('#library_inbox').filedrop({
		"url":"/library",
		"paramname":"musica",
		"maxfilesize":20,
		"allowedfiletypes":['audio/webm','audio/ogg','audio/mpeg','audio/mp3'],
	    "uploadFinished":function(i,file,response){
			$('#inbox').removeClass('ocupado');
			atualizaPlaylist();
			},
		"drop":function(){
			$('#inbox').addClass('ocupado');
			},
		"rename":function(nome){
			return escape(nome);
			},
		"error":function(err, file){}
		});

	});