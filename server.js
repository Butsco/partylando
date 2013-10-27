var express = require("express");
var http = require("http");
var _ = require("underscore");


var app = express();
app.use(express.static('public'));
var server = http.createServer(app)

var io = require('socket.io').listen(server);

var zalando = require("./apis/zalando_cached.json"); 

/**Reform**/

var top = zalando["filter-top"];
var bottom = zalando["filter-bottom"];
var shoes = zalando["filter-shoes"];

var topFull = {};
var bottomFull  = {};
var shoesFull = {};
var full = {};
for(var i in top){
  topFull[top[i].urlKey] = zalando[top[i].urlKey];
}
for(var i in bottom){
  bottomFull[bottom[i].urlKey] = zalando[bottom[i].urlKey];
}
for(var i in shoes){
  shoesFull[shoes[i].urlKey] = zalando[shoes[i].urlKey];
}

full.top = topFull;
full.bottom = bottomFull;
full.shoes = shoesFull;

for(var i in full){
  var c = 0;
  for(var o in full[i]){
    if(c<3){
       var count = 0;
        for(var x in full[i][o]){
          if(count<5){
            full[i][o][x] = {
              "imageUrl" : full[i][o][x].imageUrl,
              "name" : full[i][o][x].name,
              "sku" : full[i][o][x].sku,
              "price" : full[i][o][x].price
            }
            count  = count + 1;
          }else{
            delete full[i][o][x];
          }
          
          
        }
        full[i][o] = _.reject(full[i][o],function(f){
          if(f){
            return false;
          }else{
            return true;
          }
        })
        c = c +1;
    }else{
      delete full[i][o];
    }
  }
}
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
    rooms[data.room].participants[data.id].likes = data.likes;
    console.log("Content",data);
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
        likes : {}
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
app.get("/ios/api/rooms",function(req,res){
  var back = rooms.butsco.participants;
  back = _.values(back);
  var temp = _.clone(rooms);
  temp.butsco.participants = back;
  res.json(temp);
})
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
app.get("/api/zalando",function(req,res){
  res.json(full);
})

app.get("/api/zalando/:type",function(req,res){
  res.json(_.values(full[req.params.type]));
})

console.log("express server and websockets on port 3000");
server.listen(3000);


