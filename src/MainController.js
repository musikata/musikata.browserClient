/*
 * MainController handles showing different types of views
 * in the main content area.
 */
define(function(require){
  var Injector = require('./Injector');
  var Marionette = require('marionette');

  var PathViewFactory = require('./paths/PathViewFactory');
  var ExerciseDeckRunnerFactory = Injector.get('ExerciseDeckRunnerFactory');
  var DojoHomeView = require('./dojoHome/DojoHomeView');
  
   
  var MainController = Marionette.Controller.extend({

    initialize: function(opts) {
      this.region = opts.region;
    },

    showView: function(opts) {
      var view;
      var fitScreen = false;

      if (opts.viewType === 'ExerciseDeckRunnerView') {
        view = ExerciseDeckRunnerFactory.createView(opts);
        fitScreen = true;
      }
      else if (opts.viewType === 'PathView') {
        var viewOpts = {id: 'content'};
        view = PathViewFactory(opts.model, viewOpts);
      }
      else if (opts.viewType === 'DojoHomeView') {
        var view = new DojoHomeView(opts);
      }

      $('body').toggleClass('fit-screen', fitScreen);
      this.region.show(view);
    }

  });

  return MainController;
});
