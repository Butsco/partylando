var express = require("express");
var http = require("http");
var data_foursquare = require('./apis/foursquare_cached.json');
var data_zalando = require('./apis/zalando_cached.json');

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
var like_clothes = function(data){
    rooms[data.room].participants[data.id].likedBy.push(data.current);
    io.sockets.in(data.room).emit("person_liked", data);
}
var person_joined  = function(data){
    io.sockets.in(data.room).emit("person_joined", data.person);
}
io.on('connection',function(socket){
  socket.on("subscribe",function(data){
  	var participant = {
  		id: data.id,
  		clothing : {
  			top : {},
  			bottom : {},
  			shoes : {},
        top_cat: {},
        bottom_cat: {},
        shoes_cat: {}
  		},
        likedBy : []
  	};
  	if(!rooms[data.room]){
  		rooms[data.room] = {
  			participants : {},
  			party : {}
  		}
  	}
  	rooms[data.room].participants[data.id] = participant;
    socket.join(data.room);
    person_joined({
        room : data.room,
        person : participant
    });
    socket.emit("room_content",rooms[data.room]);
  });

  socket.on("clothing_change",function(data){
  	change_clothes(data);
  });

});

app.get("/api/rooms",function(req,res){
    res.json(rooms);
});
app.get("/api/rooms/:room",function(req,res){
	var room = req.params.room;
	res.json(rooms[room]);
});
app.post("/api/clothing/like",function(req,res){
    like_clothes(req.body)
});
app.post("/api/clothing/change",function(req,res){
	var data = req.body;
	change_clothes(data);
});

app.get("/api/events", function(req,res){
  res.json(data_foursquare);
});
app.get("/api/zalando", function(req, res){
  res.json(data_zalando);
});

console.log("express server and websockets on port 3000");
server.listen(3000);


