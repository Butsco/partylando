
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
        this.on('add', function(participant) {
            view = new ParticipantView({
                model: participant
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
        var that = this;

        this.subscription = {
            id: 'bert',
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

        socket.on('person_joined', function(data) {
            var id = data.person.id;
            participant = that.room.participants.get(id);

            if (!participant) {
                participant = new Participant({id: id});
                that.room.participants.add(participant);
            }

            participant.set({
                clothing_top: data.person.clothing.top,
                clothing_bottom: data.person.clothing.bottom,
                clothing_shoes: data.person.clothing.shoes
            })

            console.log('me?: ', participant.isMe());

            console.log(that.room.participants);
        });
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