define(function(require){
  var $ = require('jquery');
  var Marionette = require('marionette');
  var Backbone = require('backbone');

  var DojoHomeView = require('./DojoHomeView');


  var DojoHomeController = Marionette.Controller.extend({ 

    constructor: function(pathRepository){
      this.pathRepository = pathRepository;
      Marionette.Controller.apply(this);
    },

    showDojoHome: function(){
      var dfd = new $.Deferred();

      this.getUserPaths({userId: 'testUser'})
      .then( function (userPaths) {
        var pathsCollection = new Backbone.Collection();

        _.each(userPaths, function(userPathModel) {
          pathsCollection.add(userPathModel);
        });

        var dojoHomeModel = new Backbone.Model({paths: pathsCollection});

        Musikata.app.mainController.showView({
          viewType: 'DojoHomeView',
          model: dojoHomeModel
        });
      })
      .fail(function (err) {
        console.log(err, err.stack);
        dfd.reject(err);
      });

      return dfd.promise();
    },

    getUserPaths: function (opts) {
      var dfd = new $.Deferred();
      this.pathRepository.getUserPathsForUser(opts)
      .then(dfd.resolve)
      .fail(dfd.reject);

      return dfd.promise();
    }

  });

  return DojoHomeController;
});
