define(function(require){
  var Marionette = require('marionette');


  var PathsRouter = Marionette.AppRouter.extend({
    appRoutes: {
      "path/:pathId/*nodeXPath": "showPathNode",
    }
  });

  return PathsRouter;
});
