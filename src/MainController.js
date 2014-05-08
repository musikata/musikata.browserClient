/*
 * MainController handles showing different types of views
 * in the main content area.
 */
define(function(require){

  var Marionette = require('marionette');

  var PathViewFactory = require('./paths/PathViewFactory');
  var DeckViewFactory = require('./deck/DeckViewFactory');
  
   
  var MainController = Marionette.Controller.extend({

    initialize: function(opts){
      this.region = opts.region;
    },

    showView: function(viewType, viewModel){
      var view;
      var fitScreen = false;

      if (viewType === 'deck') {
        view = DeckViewFactory(viewModel);
        fitScreen = true;
      }
      else if (viewType === 'path') {
        var viewOpts = {id: 'content'};
        view = PathViewFactory(viewModel, viewOpts);
      }

      $('body').toggleClass('fit-screen', fitScreen);
      this.region.show(view);
    },
  });

  return MainController;
});
