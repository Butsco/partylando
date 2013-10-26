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

        this.$el.find('img.photo').css('width', this.$el.width()+"px");
        this.$el.css('height', this.$el.width()/0.6925+"px");
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
        _.bindAll(this, 'render', 'onChangeClothing', 'onSwipeLeft', 'onSwipeRight', 'onSwipeUp', 'onSwipeDown', 'handleHammer');
        var that = this;

        this.part = options.part;
        this.model.on('change:clothing_'+this.part, this.onChangeClothing, this);
        this.model.on('change:clothing_'+this.part+'_cat', this.onChangeClothing, this);
        this.model.on('change:drag_amount_x', this.onChangeDragAmount, this);
        this.model.on('change:drag_amount_y', this.onChangeDragAmount, this);
        

        this.$el.find('img.photo').css('width', this.$el.width()+"px");
        this.$el.css('height', this.$el.width()/0.6925+"px");

        // $('body').hammer().on("swipeleft", ".carousel-"+this.part+" .train", function(event) {
        //     that.onSwipeLeft();
        // });

        // $('body').hammer().on("swiperight", ".carousel-"+this.part+" .train", function(event) {
        //     that.onSwipeRight();
        // });

        // $('body').hammer().on("swipeup", ".carousel-"+this.part+" .train", function(event) {
        //     that.onSwipeUp();
        // });

        // $('body').hammer().on("swipedown", ".carousel-"+this.part+" .train", function(event) {
        //     that.onSwipeDown();
        // });

        $('body').hammer({ drag_lock_to_axis: true }).on(
            "release dragleft dragright dragup dragdown swipeleft swiperight swipedown swipeup", 
            ".carousel-"+this.part+" .train", this.handleHammer);
    },

    handleHammer: function(ev) {
        console.log(ev);
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch(ev.type) {
            case 'dragright':
            case 'dragleft':
            case 'dragup':
            case 'dragdown':
                // stick to the finger
                this.model.set({
                    drag_amount_x: ev.gesture.deltaX,
                    drag_amount_y: ev.gesture.deltaY
                });
                break;

            case 'swipeleft':
                this.onSwipeLeft();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                this.onSwipeRight();
                ev.gesture.stopDetect();
                break;

            case 'swipeup':
                this.onSwipeUp();
                ev.gesture.stopDetect();
                break;

            case 'swipedown':
                this.onSwipeDown();
                ev.gesture.stopDetect();
                break;

            case 'release':
                // more then 50% moved, navigate
                if(Math.abs(ev.gesture.deltaX) > this.$el.width()/2) {
                    if(ev.gesture.direction == 'right') {
                        this.onSwipeRight();
                    } else {
                        this.onSwipeLeft()
                    }
                } else if(Math.abs(ev.gesture.deltaY) > this.$el.find('.train').height()/2) {
                    if(ev.gesture.direction == 'up') {
                        this.onSwipeUp();
                    } else {
                        this.onSwipeDown()
                    }
                }
                else {
                    this.model.set({
                        drag_amount_x: 0,
                        drag_amount_y: 0
                    });
                }
                break;
        }
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

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());

        offset_x = this.$el.width() * this.model.get('clothing_'+this.part);
        offset_y = this.$el.find('.train').height() * this.model.get('clothing_'+this.part+'_cat');
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset_x+'px,-'+offset_y+'px,0px)');
    },

    onChangeDragAmount: function() {
        console.log('drag', this.model.get('drag_amount_x'), this.model.get('drag_amount_y'));
        offset_x = this.$el.width() * this.model.get('clothing_'+this.part) - this.model.get('drag_amount_x');
        offset_y = this.$el.find('.train').height() * this.model.get('clothing_'+this.part+'_cat') - this.model.get('drag_amount_y');
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset_x+'px,-'+offset_y+'px,0px)');
    },

    render: function() {
    }
});