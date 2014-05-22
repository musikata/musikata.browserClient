define(function(require) {
  var Marionette = require('marionette');
  var HBS = require('handlebars');
  var ModelBinder = require('backbone.modelbinder');

  var KataRunnerTemplate = require('text!./templates/KataRunnerView.html');

  var KataRunnerView = Marionette.Layout.extend({
    template: HBS.compile(KataRunnerTemplate),

    regions: {
      body: '.body-region'
    },

    initialize: function() {
      this.model.setView(this);
      this.modelBinder = new ModelBinder();
    },

    onRender: function() {
      this.modelBinder.bind(this.model, this.el, {
        score: '.score',
        milestones: '.milestones',
        level: '.level'
      });
    },

    showViewInBody: function(view) {
      this.body.show(view);
    }
  });

  return KataRunnerView;
});
