var express = require("express");
var http = require("http");

var app = express();
app.use(express.static('public'));
var server = http.createServer(app)

var io = require('socket.io').listen(server);
 /**
	participant : {
		id : naam
	}

 **/
var rooms = {
	"butsco" : {
		"participants" : {},
		"party" : {},
	}
}
var change_clothes = function(data){
	var clothing = data.clothing;
  	rooms[data.room].participants[data.id].clothing = clothing;
  	io.sockets.in(data.room).emit("peer_clothing_changed", data);
}
io.on('connection',function(socket){
  socket.on("subscribe",function(data){
  	var participant = {
  		id: data.id,
  		clothing : {
  			top : {},
  			bottom : {},
  			shoes : {}
  		}
  	};
  	if(!rooms[data.room]){
  		rooms[data.room] = {
  			participants : [],
  			party : {}
  		}
  	}
  	rooms[data.room].participants[data.id] = participant;
  });

  socket.on("clothing_change",function(data){
  	change_clothes(data);
  });
  
});

app.get("/api/room",function(req,res){
	var room = req.body.room;
	res.json(rooms[room]);
})
app.post("/api/clothing/change",function(req,res){
	var data = req.body;
	change_clothes(data);
});

console.log("express server and websockets on port 3000");
app.listen(3000);