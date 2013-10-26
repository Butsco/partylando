var App = Backbone.Model.extend({
    initialize: function(){
        console.log("init");
    }
});

$(function(){
    window.app = new App();
});