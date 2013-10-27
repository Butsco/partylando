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
        }, { part: 'top' }).render();

        this.carouselCarousel = new MeCarouselView({
            model: this.model,
            el: this.$el.find('.carousel-bottom')
        }, { part: 'bottom' }).render();

        this.shoesCarousel = new MeCarouselView({
            model: this.model,
            el: this.$el.find('.carousel-shoes')
        }, { part: 'shoes' }).render();
        
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
        }, {part: 'top'}).render();

        this.bottomCarousel = new CarouselView({
            model: this.model,
            el: this.$el.find('.carousel-bottom')
        }, {part: 'bottom'}).render();

        this.shoesCarousel = new CarouselView({
            model: this.model,
            el: this.$el.find('.carousel-shoes')
        }, {part: 'shoes'}).render();

        return this;
    }
});


var CarouselView = Backbone.View.extend({
    
    initialize: function(model, options) {
        _.bindAll(this, 'render', 'onChangeClothing');

        this.part = options.part;
        this.model.on('change:clothing_'+this.part, this.onChangeClothing, this);
        this.model.on('change:clothing_'+this.part+'_cat', this.onChangeClothing, this);

        this.$el.find('img.photo').css('width', (this.$el.width()-90)+"px");
        this.$el.css('height', (this.$el.width()-90)/0.6925+"px");
    },

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset_x = this.$el.width() * this.model.get('clothing_'+this.part);
        offset_y = this.$el.find('.train').height() * this.model.get('clothing_'+this.part+'_cat');
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset_x+'px,-'+offset_y+'px,0px)');
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
        this.model.on('change:clothing_'+this.part+'_cat', this.onChangeClothing, this);

        this.$el.find('img.photo').css('width', (this.$el.width()-90)+"px");
        this.$el.css('height', (this.$el.width()-90)/0.6925+"px");

        $('body').hammer().on("swipeleft", ".carousel-"+this.part+" .train", function(event) {
            that.onSwipeLeft();
            that.recalcPrice();
        });

        $('body').hammer().on("swiperight", ".carousel-"+this.part+" .train", function(event) {
            that.onSwipeRight();
            that.recalcPrice();
        });

        $('body').hammer().on("swipeup", ".carousel-"+this.part+" .train", function(event) {
            that.onSwipeUp();
            that.recalcPrice();
        });

        $('body').hammer().on("swipedown", ".carousel-"+this.part+" .train", function(event) {
            that.onSwipeDown();
            that.recalcPrice();
        });
        $('body').hammer().on("tap", ".carousel-"+this.part+" .train", function(event) {
            that.onSwipeLeft();
            that.recalcPrice();
        });
    },

    onSwipeRight: function() {
        values = {}
        values['clothing_'+this.part] = Math.max(0, this.model.get('clothing_'+this.part) - 1);
        this.model.set(values)
    },

    onSwipeLeft: function() {
        values = {}
        values['clothing_'+this.part] = Math.min(14, this.model.get('clothing_'+this.part) + 1);
        this.model.set(values)
    },

    onSwipeUp: function() {
        values = {}
        values['clothing_'+this.part+'_cat'] = Math.min(2, this.model.get('clothing_'+this.part+'_cat') + 1);
        this.model.set(values)
    },

    onSwipeDown: function() {
        values = {}
        values['clothing_'+this.part+'_cat'] = Math.max(0, this.model.get('clothing_'+this.part+'_cat') - 1);
        this.model.set(values)
    },
    recalcPrice : function(){
        var values = this.model.attributes;
        var data = window.data;

        var topProduct = _.values(data["top"])[values.clothing_top_cat][values.clothing_top];
        var bottomProduct = _.values(data["bottom"])[values.clothing_bottom_cat][values.clothing_bottom];
        var shoesProduct = _.values(data["shoes"])[values.clothing_shoes_cat][values.clothing_shoes];
        
        $("#price").html("€" + (topProduct.price + bottomProduct.price+ shoesProduct.price));

    },
    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset_x = this.$el.width() * this.model.get('clothing_'+this.part);
        offset_y = this.$el.find('.train').height() * this.model.get('clothing_'+this.part+'_cat');
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset_x+'px,-'+offset_y+'px,0px)');
    },

    render: function() {
    }
});