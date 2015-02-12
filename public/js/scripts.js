var $audio;
var audioSrc;

var audioCtx = new AudioContext(),
		analyser = audioCtx.createAnalyser();

function startSong(audioEl){
	audioSrc = ctx.createMediaElementSource(audioEl);
	audioEl.play()
};

$(function(){

	$audio = $('audio');

});