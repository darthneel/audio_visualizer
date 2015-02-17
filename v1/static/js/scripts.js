var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser;
var currentSong;
var freqData;

var range = d3.range(0,20);
var colorScale = d3.scale.category20c()

Array.prototype.sample = function() {
  var idx = Math.floor(this.length * Math.random());
  return this[idx]
};

function setUpAudio(audio){
  freqData = new Uint8Array(analyser.frequencyBinCount);

  var source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
};

function projectData(data){

  var svg = d3.select('svg');

  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle');

 var circles = svg.selectAll('circle')
                .data(data)
                  .attr('r', function(d){
                    return d/5 +'px'
                  })
                  .attr('cx', function(d, i){
                  	return i*50 + 'px'
                  })
                  .attr('cy', function(){ 
                    return '100px'
                  })
                  .style('opacity', function(){ 
                    return .7 
                  })
                  .style('fill', function(d){ 
                  	return colorScale(d/5); 
                  });

  svg.selectAll('circle')
      .data(data)
        .exit()
        .remove();

}

$(function(){

  $("select").on("change", function(){
    var song = $(this).val();
    console.log(song);

    var audio = $("#" + song)[0];
    console.log(audio);

    if(currentSong && audio != currentSong){
      console.log(currentSong);
      currentSong.pause();
      
      setUpAudio(audio);

      audio.play();
      currentSong = audio
      requestAnimationFrame(renderFrame);
    }else if(!currentSong){
      console.log(currentSong);
      
      setUpAudio(audio);

      audio.play();
      currentSong = audio
      requestAnimationFrame(renderFrame);
    }else{
      return "Else hit"
    }
  });

	d3.select('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('background-color', '#2c3e50')

	analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32;
	
 //  var source = audioCtx.createMediaElementSource(audio);
	// source.connect(analyser);
	// analyser.connect(audioCtx.destination);

	// var freqData = new Uint8Array(analyser.frequencyBinCount);
	// console.log(freqData)

	function renderFrame() {
		// update data in frequencyData
		analyser.getByteFrequencyData(freqData);
		// console.log(freqData);
		// render frame based on values in frequencyData
		projectData(freqData);

    requestAnimationFrame(renderFrame);
  };



})