
var Room = Backbone.Model.extend({
    defaults: {
        name: undefined
    },

    initialize: function() {
        this.participants = new ParticpantCollection();
    }
});


var ParticpantCollection = Backbone.Collection.extend({
    model: Participant,
    initialize: function() {
        var that = this;
        this.on('add', function(participant) {
            element = document.getElementById('participant-'+(that.indexOf(participant)+1));
            view = new ParticipantView({
                model: participant,
                el: element
            }).render();
        });
    }
});

var Participant = Backbone.Model.extend({
    defaults: {
        clothing_top: undefined,
        clothing_bottom: undefined,
        clothing_shoes: undefined
    },

    isMe: function() {
        return this.id === app.subscription.id
    }
});

var App = Backbone.Model.extend({
    initialize: function(){
        _.bindAll(this, 'person_joined');
        var that = this;

        this.subscription = {
            id: document.location.hash ? document.location.hash.substring(1) : 'anonymous',
            room: 'butsco'
        };

        this.room = new Room({
            name: this.subscription.room
        });

        var socket = io.connect(document.location);
        socket.on('connect', function () {
            console.log("subscribe", that.subscription);
            socket.emit('subscribe', that.subscription);
        });

        socket.on('room_content', function (data) {
            console.log("room_content", data);
            for (i in data.participants) {
                var participant = data.participants[i];
                that.person_joined(participant);
            }
        });

        socket.on('person_joined', this.person_joined, this);
    },

    person_joined: function(data) {
        var id = data.id;
        participant = this.room.participants.get(id);

        if (!participant) {
            participant = new Participant({id: id});
            if (!participant.isMe()) {
                this.room.participants.add(participant);
            }
        }

        if (!participant.isMe()) {
            return;
        }

        participant.set({
            clothing: {
                top: data.clothing.top,
                bottom: data.clothing.bottom,
                shoes: data.clothing.shoes
            }
        })

        console.log('person_joined', participant.toJSON(), this.room.participants.length);
    }
});

$(function(){

    // fetch templates
    $("script[type='text/template']").each(function(index,tag){
        $.ajax({
            url: $(tag).attr('src'),
            method: 'GET',
            async: false,
            contentType: 'text',
            success: function (data) {
                $(tag).html(data)
            }
        });
    });

    window.app = new App();
});