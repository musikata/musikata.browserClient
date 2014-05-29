define(function(require) {
  var _ = require('underscore');
  var Marionette = require('marionette');
  var HBS = require('handlebars');
  var ModelBinder = require('backbone.modelbinder');

  var KataRunnerTemplate = require('text!./templates/KataRunnerView.html');

  var KataRunnerView = Marionette.Layout.extend({
    template: HBS.compile(KataRunnerTemplate),

    regions: {
      body: '.body-region'
    },

    ui: {
      actions: '.actions'
    },

    events: {
      'click @ui.actions': 'onClickAction'
    },

    initialize: function() {
      this.model.view = this;
      this.modelBinder = new ModelBinder();
    },

    onClickAction: function(e) {
      var action = $(e.target).data('action');
      this.trigger('action:' + action); 
      console.log('oca', action);
    },

    onRender: function() {
      this.modelBinder.bind(this.model, this.el, {
        score: '.score',
        milestones: '.milestones',
        level: '.level',
      });

      // Manually bind actions.
      this.listenTo(this.model.actions, 'reset add remove', function() {
        this.ui.actions.empty();
        _.each(this.model.actions.models, function(actionModel) {
          this.ui.actions.append('<button data-action="' + actionModel.action + '">' + actionModel.label + '</button>');
        }, this);
      }, this);
    },

    setBodyView: function(view) {
      this.body.show(view);
    }
  });

  return KataRunnerView;
});
