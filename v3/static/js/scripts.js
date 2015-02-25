var vis;

var Visualizer = function(){
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  this.range = d3.range(0,20);
  this.colorScale = d3.scale.category20c();
  this.analyser;
  this.currentSong;
  this.freqData;
  this.barWidth = 20;
  this.width = 800;
  this.height = 300;
  this.y;
  this.y = d3.scale.linear()
            .domain([0, 255])
            .range([this.height, 0]);
};

Visualizer.prototype = {
  init: function(){
    var that = this;
    d3.select('svg')
      .attr('width', that.width)
      .attr('height', that.height)
      .style('background-color', '#2c3e50')

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 32;

    this.addEventListener();
  },
  projectData: function(data){
    var that = this;

 


    var svg = d3.select('svg');

    svg.selectAll('rect')
    .data(data)
      .exit()
      .remove(); 

    var bars = svg.selectAll('rect')
                      .data(data)
                      .enter().append("rect")
                      
   var bars = svg.selectAll('rect')
                  .data(data)
                    .attr('x', function(d, i){
                      return that.barWidth + i * 50;
                    })
                    .attr('y', function(d) { return that.y(d); })
                    .attr('height', function(d) { 
                      return that.height - that.y(d);
                    })
                    .attr('width', function(){ 
                      return that.barWidth;
                    })
                    .style('opacity', function(){ 
                      return .8;
                    })
                    .style('fill', function(d){ 
                      return that.colorScale(d/5); 
                    });

  },
  setUpAudio: function(audio){
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    // this.y = d3.scale.linear()
    //         .domain([0, d3.max(this.freqData)])
    //         .range([this.height, 0]);

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
    // this.y = d3.scale.linear()
    //     .domain([0, d3.max(this.freqData)])
    //     .range([this.height, 0]);
    this.projectData(this.freqData);

    requestAnimationFrame(this.renderFrame.bind(this));
  }
};


$(function(){

  vis = new Visualizer();

  vis.init();

})