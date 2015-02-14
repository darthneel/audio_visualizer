var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser;
var audio;

Array.prototype.sample = function() {
  var idx = Math.floor(this.length * Math.random());
  return this[idx]
};

var range = d3.range(0,20);
var colorScale = d3.scale.category20c()

function projectData(data){

  // Select Entire SVG
  var svg = d3.select('svg');

  // Need new circle?  If so... build them!
  var circles = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle');

  // Update visualization with new data
   var circles = svg.selectAll('circle')
                  .data(data)
                  .transition()
                    .duration(100)
                      .attr('r', function(d){return d/10 +'px'})
                      .attr('cx', function(d, i){
                      	// var index = data.indexof(d);
                      	// console.log(i); 
                      	return i+5 + 'px'})
                      .attr('cy', function(){ return '100px'})
                      .style('opacity', function(){ return .3 })
                      .style('fill', function(d){ 
                      	// console.log(colorScale(d));
                      	return colorScale(d); 
                      });


    // remove unnneeded circles
    svg.selectAll('circle')
        .data(data)
          .exit()
          .remove();

}

$(function(){

	d3.select('svg')
    .attr('width', '100%')
    .attr('height', '75%')
    .style('border', '1px solid black');

	audio = $('audio')[0]
	analyser = audioCtx.createAnalyser();
	var source = audioCtx.createMediaElementSource(audio);

	source.connect(analyser);

	analyser.connect(audioCtx.destination);

	var freqData = new Uint8Array(analyser.frequencyBinCount);
	console.log(freqData)
var sent = false;
	function renderFrame() {
		requestAnimationFrame(renderFrame);
		// update data in frequencyData
		analyser.getByteFrequencyData(freqData);
		if (freqData[600] > 0 && !sent) { console.log(freqData); sent = true  };
		// render frame based on values in frequencyData
		// console.log(frequencyData)
		// projectData(freqData);
		// console.log(freqData)
		// console.log(freqData.length)
	}

	audio.play();
	// setInterval(function(){
 //    projectData(renderFrame());
 //  }, 150)
	renderFrame();

})