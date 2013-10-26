var ParticipantView = Backbone.View.extend({
    className: 'participant',

    initialize: function() {
        _.bindAll(this, 'render');
        $("#participants").append(this.$el);

        this.template = _.template($('#participant-template').html())
    },

    render: function() {
        var html = this.template({
            id: this.model.id
        });

        this.$el.html(html);
        return this;
    }
});