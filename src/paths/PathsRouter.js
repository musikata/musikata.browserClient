define(function(require){
  var Marionette = require('marionette');

  var PathsController = require('./PathsController');


  var PathsRouter = Marionette.AppRouter.extend({
    appRoutes: {
      "path/:pathId/*nodePath": "showPathNode",
    },
    controller: new PathsController()
  });

  return PathsRouter;
});
