var MeView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#me-template').html())

        this.topCarousel = new CarouselView({
            model: this.model
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

var ParticipantView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#participant-template').html())
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });

        this.$el.html(html);

        window.m = this.model;

        this.topCarousel = new CarouselView({
            model: this.model,
            el: this.$el.find('.carousel-top')
        }, {
            part: 'top'
        }).render();

        return this;
    }
});


var CarouselView = Backbone.View.extend({
    
    initialize: function(model, options) {
        _.bindAll(this, 'render', 'onChangeClothing');

        this.part = options.part;
        this.model.on('change:clothing_'+this.part, this.onChangeClothing, this);
    },

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset = this.$el.width() * this.model.get('clothing_'+this.part)
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset+'px,0px,0px)')
    },

    render: function() {
    }
});