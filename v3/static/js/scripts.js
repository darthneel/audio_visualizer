var vis;

var Visualizer = function(){
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.range = d3.range(0,20);
  this.colorScale = d3.scale.category20c();
  this.analyser;
  this.currentSong;
  this.freqData;
  this.barWidth = 25;
  this.width = 800;
  this.height = 600;
  this.x = d3.scale.linear()
            .range([this.barWidth / 2, this.width - this.barWidth / 2]);
  this.y = d3.scale.linear()
            .range([this.height, 0]);

  console.log(this.y(125));
};

Visualizer.prototype = {
  init: function(){
    var that = this;
    d3.select('svg')
      .attr('width', that.width + 'px')
      .attr('height', that.height + 'px')
      .style('background-color', '#2c3e50')

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 32;

    this.addEventListener();
  },
  projectData: function(data){
    var that = this;

    var svg = d3.select('svg');

    var bars = svg.selectAll('rect')
                      .data(data)
                      .enter()
                      .append('rect');

   var bars = svg.selectAll('rect')
                  .data(data)
                    .attr('x', function(d, i){
                      return 25 * i + 30 + 'px';
                    })
                    .attr('height', function(d) { 
                      return 50 - that.y(d); 
                    })
                    .attr('width', function(){ 
                      return '25px';
                    })
                    .style('opacity', function(){ 
                      return .8;
                    })
                    .style('fill', function(d){ 
                      return that.colorScale(d/5); 
                    });

    svg.selectAll('rect')
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