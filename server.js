var express = require("express");
var http = require("http");

var app = express();
app.use(express.static('public'));
var server = http.createServer(app)

var io = require('socket.io').listen(server)

io.on('connection',function(socket){
  socket.emit('init',{msg:"test"})
});

app.listen(3000);