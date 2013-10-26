var MeView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#me-template').html())
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });

        this.$el.html(html);
        return this;
    }
});

var ParticipantView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#participant-template').html())

        this.topCarousel = new CarouselView({
            model: participant
        }, {
            part: 'top'
        }).render();
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });

        this.$el.html(html);
        return this;
    }
});


var CarouselView = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, 'render');

        this.name = options.name;
        this.model.on('change:clothing', this.onChangeClothing, this);
    },

    onChangeClothing: function() {

    },

    render: function() {

    }
});