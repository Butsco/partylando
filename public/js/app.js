
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
    },


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

        socket.on('person_joined', function(data) {
            var id = data.person.id;
            participant = that.room.participants.get(id);

            if (!participant) {
                participant = new Participant({id: id});
                if (!participant.isMe()) {
                    that.room.participants.add(participant);
                }
            }

            if (!participant.isMe()) {
                return;
            }

            participant.set({
                clothing: {
                    top: data.person.clothing.top,
                    bottom: data.person.clothing.bottom,
                    shoes: data.person.clothing.shoes
                }
            })

            console.log('person_joined', participant.toJSON(), that.room.participants.length);
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