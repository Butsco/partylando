

var App = Backbone.Model.extend({
    initialize: function(){
        this.subscription = {
            id: 'bert',
            room: 'butsco'
        };

        var that = this;
        var socket = io.connect(document.location);
        socket.on('connect', function () {
            console.log("subscribe", that.subscription);
            socket.emit('subscribe', that.subscription);
        });
    }
});

$(function(){
    window.app = new App();
});