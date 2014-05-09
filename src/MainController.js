/*
 * MainController handles showing different types of views
 * in the main content area.
 */
define(function(require){
  var Injector = require('./Injector');
  var Marionette = require('marionette');

  var PathViewFactory = require('./paths/PathViewFactory');
  var ExerciseDeckRunnerFactory = Injector.get('ExerciseDeckRunnerFactory');
  
   
  var MainController = Marionette.Controller.extend({

    initialize: function(opts) {
      this.region = opts.region;
    },

    showView: function(opts) {
      var view;
      var fitScreen = false;

      if (opts.viewType === 'deck') {
        view = ExerciseDeckRunnerFactory.createView(opts.model, opts.opts);
        fitScreen = true;
      }
      else if (opts.viewType === 'path') {
        var viewOpts = {id: 'content'};
        view = PathViewFactory(opts.model, viewOpts);
      }

      $('body').toggleClass('fit-screen', fitScreen);
      this.region.show(view);
    }

  });

  return MainController;
});
