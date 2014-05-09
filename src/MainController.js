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

    initialize: function(opts){
      this.region = opts.region;
    },

    showView: function(viewType, viewModel, opts){
      var view;
      var fitScreen = false;

      if (viewType === 'deck') {
        view = ExerciseDeckRunnerFactory.createView(viewModel, opts);
        fitScreen = true;
      }
      else if (viewType === 'path') {
        var viewOpts = {id: 'content'};
        view = PathViewFactory(viewModel, viewOpts);
      }

      $('body').toggleClass('fit-screen', fitScreen);
      this.region.show(view);
    }

  });

  return MainController;
});
