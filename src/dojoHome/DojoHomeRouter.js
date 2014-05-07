define(function(require){
  var Marionette = require('marionette');
  var Backbone = require('backbone');

  var DojoHomeController = require('./DojoHomeController');


  var DojoHomeRouter = Marionette.AppRouter.extend({
    appRoutes: {
      'dojo': 'showDojoHome'
    },
    controller: new DojoHomeController() 
  });

  return DojoHomeRouter;

});
