var LikeButtonsView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#me-template').html())
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });
    }
});

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
        _.bindAll(this, 'render', 'onLike','onUnlike');
        var that = this;
        this.template = _.template($('#participant-template').html())

        
        this.model.on('change:likes', this.onChangeLikes, this);
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });
        var that = this;
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

        this.$el.find('.up').on("click",function(event) {
            that.onLike();
        });
        this.$el.find('.down').on("click",function(event) {
            that.onUnlike();
        });
        this.onChangeLikes();
        return this;
    },
    onLike : function(){

        values = {};
        values.likes = _.values(_.clone(this.model.get("likes")));
        values.likes.push({
            clothing_top: this.model.get("clothing_top"),
            clothing_bottom: this.model.get("clothing_bottom"),
            clothing_shoes: this.model.get("clothing_shoes"),
            clothing_top_cat: this.model.get("clothing_top_cat"),
            clothing_bottom_cat: this.model.get("clothing_bottom_cat"),
            clothing_shoes_cat: this.model.get("clothing_shoes_cat"),
            liker : app.subscription.id,
            type: "like"
        }) 
        console.log(values.likes);
        this.model.set(values);
    },
    onUnlike : function(){
        values = {};
        values.likes = _.values(_.clone(this.model.get("likes")));
        values.likes.push({
            clothing_top: this.model.get("clothing_top"),
            clothing_bottom: this.model.get("clothing_bottom"),
            clothing_shoes: this.model.get("clothing_shoes"),
            clothing_top_cat: this.model.get("clothing_top_cat"),
            clothing_bottom_cat: this.model.get("clothing_bottom_cat"),
            clothing_shoes_cat: this.model.get("clothing_shoes_cat"),
            liker : app.subscription.id,
            type: "dislike"
        }) 
        this.model.set(values);
    },
    onChangeLikes : function(){
        var likes = this.model.get("likes");
        var $buttons = this.$el.find(".like_buttons");
        $buttons.removeClass("dislike");
        $buttons.removeClass("like");
        for(var i in likes){
            var like = likes[i];
            if(like.liker == app.subscription.id){
                if(like.clothing_top == this.model.get("clothing_top")&&
                    like.clothing_bottom == this.model.get("clothing_bottom")&&
                    like.clothing_shoes == this.model.get("clothing_shoes")&&
                    like.clothing_top_cat == this.model.get("clothing_top_cat")&&
                    like.clothing_bottom_cat == this.model.get("clothing_bottom_cat")&&
                    like.clothing_shoes_cat == this.model.get("clothing_shoes_cat")){
                    if(like.type == "like"){
                       
                        $buttons.addClass("like");
                    }else{
                       
                        $buttons.addClass("dislike");
                    }
                }
            }
        }
    }
});


var CarouselView = Backbone.View.extend({
    
    initialize: function(model, options) {
        _.bindAll(this, 'render', 'onChangeClothing');

        this.part = options.part;
        this.model.on('change:clothing_'+this.part, this.onChangeClothing, this);
        this.model.on('change:clothing_'+this.part+'_cat', this.onChangeClothing, this);
    },

    onChangeClothing: function() {
        console.log('change: ', this.model.toJSON());
        offset_x = 150 * this.model.get('clothing_'+this.part);
        offset_y = 144 * this.model.get('clothing_'+this.part+'_cat');
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


        this.$el.find('.arrow-left').on('click', function() {
            that.onSwipeRight();
        });

        this.$el.find('.arrow-right').on('click', function() {
            that.onSwipeLeft();
        });

        this.$el.find('.arrow-up').on('click', function() {
            that.onSwipeUp();
        });

        this.$el.find('.arrow-down').on('click', function() {
            that.onSwipeDown();
        });

        
    },

    onSwipeRight: function() {
        values = {}
        values['clothing_'+this.part] = Math.max(0, this.model.get('clothing_'+this.part) - 1);
        this.model.set(values)
    },

    onSwipeLeft: function() {
        values = {}
        values['clothing_'+this.part] = Math.min(9, this.model.get('clothing_'+this.part) + 1);
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
        offset_x = 150 * this.model.get('clothing_'+this.part);
        offset_y = 144 * this.model.get('clothing_'+this.part+'_cat');
        this.$el.find('.train').css('-webkit-transform','translate3d(-'+offset_x+'px,-'+offset_y+'px,0px)');
    },

    render: function() {
    }
});