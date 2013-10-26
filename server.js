var express = require("express");
var io = require('socket.io').listen(server)

var app = express();


io.on('connection',function(socket){
  socket.emit('init',{msg:"test"})
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);