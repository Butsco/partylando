var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app)

var io = require('socket.io').listen(server)

io.on('connection',function(socket){
  socket.emit('init',{msg:"test"})
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);