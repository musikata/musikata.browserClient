define(function(require){
  var Marionette = require('marionette');
  var Backbone = require('backbone');

  var DojoHomeView = require('./DojoHomeView');


  var DojoHomeController = Marionette.Controller.extend({ 

    constructor: function(pathRepository){
      this.pathRepository = pathRepository;
      Marionette.Controller.apply(this);
    },

    showDojoHome: function(){
      var pathsCollection = new Backbone.Collection();
      _.each(Musikata.db.paths, function(pathModel){
        pathsCollection.add(pathModel);
      });

      var dojoHomeView = new DojoHomeView({
        model: new Backbone.Model({
          paths: pathsCollection
        })
      });
      app.content.show(dojoHomeView);
    },

    getUserPaths: function () {
    }

  });

  return DojoHomeController;
});
