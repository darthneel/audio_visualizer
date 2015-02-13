var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser;
var audio;



$(function(){
	audio = $('audio')[0]
	analyser = audioCtx.createAnalyser();
	var source = audioCtx.createMediaElementSource(audio);

	source.connect(analyser);

	analyser.connect(audioCtx.destination);

	var freqData = new Uint8Array(analyser.frequencyBinCount);
	console.log(freqData)

	function renderFrame() {
		requestAnimationFrame(renderFrame);
		// update data in frequencyData
		analyser.getByteFrequencyData(freqData);
		// render frame based on values in frequencyData
		// console.log(frequencyData)
		console.log(freqData)
		console.log(freqData.length)
	}

	audio.play();
	renderFrame();
})