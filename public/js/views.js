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

        this.topCarousel = new MeCarouselView({
            model: this.model,
            el: this.$el.find('.carousel-top')
        }, {
            part: 'top'
        }).render();
        
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

        this.$el.find('img.photo').css('width', this.$el.width()+"px");
    },

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset = this.$el.width() * this.model.get('clothing_'+this.part);
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset+'px,0px,0px)');
    },

    render: function() {
    }
});



var MeCarouselView = Backbone.View.extend({
    
    initialize: function(model, options) {
        _.bindAll(this, 'render', 'onChangeClothing', 'onSwipeLeft', 'onSwipeRight');
        var that = this;

        this.part = options.part;
        this.model.on('change:clothing_'+this.part, this.onChangeClothing, this);

        this.$el.find('img.photo').css('width', this.$el.width()+"px");

        $('body').hammer({
            drag: false,
            transform: false,
            swipe: true
        }).on("swipeleft", ".train", function(event) {
            that.onSwipeLeft();
        });

        $('body').hammer({
            drag: false,
            transform: false,
            swipe: true
        }).on("swiperight", ".train", function(event) {
            that.onSwipeRight();
        });
    },

    onSwipeRight: function() {
        values = {}
        values['clothing_'+this.part] = Math.max(0, this.model.get('clothing_'+this.part) - 1);
        this.model.set(values)
    },

    onSwipeLeft: function() {
        values = {}
        values['clothing_'+this.part] = Math.min(2, this.model.get('clothing_'+this.part) + 1);
        this.model.set(values)
    },

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset = this.$el.width() * this.model.get('clothing_'+this.part);
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset+'px,0px,0px)');
    },

    render: function() {
    }
});