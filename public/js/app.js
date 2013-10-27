
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
        clothing_top: 0,
        clothing_bottom: 0,
        clothing_shoes: 0,
        clothing_top_cat: 0,
        clothing_bottom_cat: 0,
        clothing_shoes_cat: 0
    },

    initialize: function() {
        _.bindAll(this, 'isMe', 'onChange');
        this.on('change', this.onChange, this);
    },

    isMe: function() {
        return this.id === app.subscription.id
    },

    onChange: function() {
        app.socket.emit('clothing_change', {
            room: app.subscription.room,
            id: this.id,
            clothing: {
                top: this.get('clothing_top'),
                bottom: this.get('clothing_bottom'),
                shoes: this.get('clothing_shoes'),
                top_cat: this.get('clothing_top_cat'),
                bottom_cat: this.get('clothing_bottom_cat'),
                shoes_cat: this.get('clothing_shoes_cat')
            }
        });
    }
});

var App = Backbone.Model.extend({
    initialize: function(){
        _.bindAll(this, 'person_joined', 'peer_clothing_changed');
        var that = this;

        this.subscription = {
            id: document.location.hash ? document.location.hash.substring(1) : 'anonymous',
            room: 'butsco'
        };

        this.room = new Room({
            name: this.subscription.room
        });

        this.socket = io.connect(document.location);
        this.socket.on('connect', function () {
            console.log("subscribe", that.subscription);
            that.socket.emit('subscribe', that.subscription);

            that.me = new Participant({
                id: that.subscription.id,
                clothing: {
                    top: 0,
                    bottom: 0,
                    shoes: 0
                }
            });

            new MeView({
                model: that.me,
                el: document.getElementById('participant-0')
            }).render();
        });

        this.socket.on('room_content', function (data) {
            console.log("room_content", data);
            for (i in data.participants) {
                var participant = data.participants[i];
                that.person_joined(participant);
            }
        });

        this.socket.on('person_joined', this.person_joined, this);
        this.socket.on('peer_clothing_changed', this.peer_clothing_changed, this);
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
    },

    peer_clothing_changed: function(data) {
        participant = this.room.participants.get(data.id);

        if (participant) {
            participant.set({
                'clothing_top': data.clothing.top,
                'clothing_bottom': data.clothing.bottom,
                'clothing_shoes': data.clothing.shoes,
                'clothing_top_cat': data.clothing.top_cat,
                'clothing_bottom_cat': data.clothing.bottom_cat,
                'clothing_shoes_cat': data.clothing.shoes_cat
            });
        }
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
    $.ajax({
            url: "/api/zalando",
            method: 'GET',
            async: false,
            contentType: 'text',
            success: function (data) {
                console.log(data);
                window.data = data;
            }
        });
    $('#test').hammer({
        drag: false,
        transform: false,
        swipe: true
    }).on("swipeup", "", function(event) {
        console.log(this, event);
    });

    new ScrollFix(document);
    $("input, textarea, .dontscroll").on('touchmove', function(event){
        event.preventDefault()
    });
    

    window.app = new App();
});