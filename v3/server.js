var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname + '/static'));

app.listen(3000, function () {
  console.log('App listening on port 3000');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
});


