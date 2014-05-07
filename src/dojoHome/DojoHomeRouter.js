define(function(require){
  var Marionette = require('marionette');
  var Backbone = require('backbone');

  var DojoHomeView = require('./DojoHomeView');


  var DojoHomeRouter = Marionette.AppRouter.extend({
    appRoutes: {
      'dojo': 'showDojoHome'
    },
    controller: {
      showDojoHome: function(){
        var pathsCollection = new Backbone.Collection();
        // @TODO: get paths here.
        _.each(Musikata.db.paths, function(pathModel){
          pathsCollection.add(pathModel);
        });

        var dojoHomeView = new DojoHomeView({
          model: new Backbone.Model({
            paths: pathsCollection
          })
        });
        // @TODO: figure out how to wire app dependency.
        // perhaps via messaging?
        app.content.show(dojoHomeView);
      }
    }
  });

  return DojoHomeRouter;

});
