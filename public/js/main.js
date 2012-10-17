$(function(){
	
	// config
	var atualizandoPlaylist;
	var intervaloDeAtualizacao = 3000;
	var playlist = [];
	var musicaAtual = false;

	// atualiza e mantém atualizadas as informações da playlist
	function atualizaPlaylist(){
		clearInterval(atualizandoPlaylist);
		CarregaPlaylist();
		atualizandoPlaylist = setInterval(CarregaPlaylist, intervaloDeAtualizacao);
		}

	// carrega informações atualizadas da playlist
	function CarregaPlaylist(){
		$.getJSON('/playlist/playlist.json', function(pl){
			playlist = pl;
			$('ul#playlist').html(
				playlist.length
					? playlist.map(function(musica){
						return '<li id="musica_'+musica.time+'"><a href="javascript:void(0);" title="Reproduzir" class="nome"><b>▸</b>'+musica.nome+'</a></li>';
						}).join('')
					: '<li><span class="empty">Não há músicas na playlist.</span></li>'
				);
			if(musicaAtual !== false)
				$('#musica_'+musicaAtual.time).addClass('playing');
			});
		}

	// reproduz proxima musica
	function playNext(){
		for(var i=0,l=playlist.length;i<l;i++)
			if(playlist[i].time == musicaAtual.time)
				{	
				musicaAtual = playlist[
					i+1<l
						? i+1
						: 0
					];
				break;
				}
		play();
		}

	// reproduz musica atual ou musica especificada
	function play(qual){
		if(!playlist.length)
			return;
		if(typeof qual != 'undefined')
			playlist.forEach(function(musica){
				if(musica.time == qual)
					musicaAtual = musica;
				});
		var audio = $('audio');
		audio.attr('src', '').attr('src', '/playlist/'+musicaAtual.time+'.'+musicaAtual.nome.split('.').pop()).get(0).play();
		$('#player').slideDown();
		$('ul#playlist li').removeClass('playing').filter('#musica_'+musicaAtual.time).addClass('playing');
		}

	// upload
	$('#aeroporto').filedrop({
		"url":"/playlist",
		"paramname":"musica",
		"maxfilesize":20,
		"allowedfiletypes":['audio/webm','audio/ogg','audio/mpeg','audio/mp3'],
	    "uploadFinished":function(i,file,response){
			$('#aeroporto').removeClass('ocupado');
			atualizaPlaylist();
			},
		"drop":function(){
			$('#aeroporto').addClass('ocupado');
			},
		"rename":function(nome){
			return escape(nome);
			}
		});

	// click direto na música da playlist
	$('ul#playlist a.nome').live('click', function(){
		play($(this).closest('li').attr('id').replace('musica_', ''));
		});

	// inicializa áudio
	$('audio').on({
		'ended':playNext,
		'error':function(){
			alert('Houve um erro.');
			}
		});

	// dispara o carregamento da playlist
	atualizaPlaylist();
	$('#player').hide();
	});