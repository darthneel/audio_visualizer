var vis;

var Visualizer = function(){
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.range = d3.range(0,20);
  this.colorScale = d3.scale.category20c();
  this.analyser;
  this.currentSong;
  this.freqData;

};

Visualizer.prototype = {
  init: function(){
    d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('background-color', '#2c3e50')

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 32;

    this.addEventListener();
  },
  projectData: function(data){
    var that = this;

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
                      return that.colorScale(d/5); 
                    });

    svg.selectAll('circle')
        .data(data)
          .exit()
          .remove();
  },
  setUpAudio: function(audio){
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    var source = this.audioCtx.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  },
  addEventListener: function(){
    var that = this;
    console.log(that);

    $("select").on("change", function(){
      var song = $(this).val();
      console.log(song);

      var audio = $("#" + song)[0];
      console.log(audio);

      if(that.currentSong && audio != that.currentSong){
        console.log(that.currentSong);
        that.currentSong.pause();
        
        that.setUpAudio(audio);

        audio.play();
        that.currentSong = audio
        requestAnimationFrame(that.renderFrame.bind(that));
      }else if(!that.currentSong){
        console.log(that.currentSong);
        
        that.setUpAudio(audio);

        audio.play();
        that.currentSong = audio
        requestAnimationFrame(that.renderFrame.bind(that));
      }else{
        return "Else hit"
      }
    });
  },
  renderFrame: function(){
    this.analyser.getByteFrequencyData(this.freqData);
    this.projectData(this.freqData);

    requestAnimationFrame(this.renderFrame.bind(this));
  }
};


$(function(){

  vis = new Visualizer();

  vis.init();

})