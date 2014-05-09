define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');


  var PathRepository = Marionette.Controller.extend({

    constructor: function() {
      this.storageKey = 'musikata.paths';
      Marionette.Controller.apply(this);
    },

    getNode: function(opts) {
      console.log('get node');
      var path = Musikata.db.paths[opts.pathId];
      var node = path.getNodeByPath(opts.nodePath);
      return node;
    },

    updateNode: function(opts) {
      console.log('update node');
    },

    updateUserPath: function(userPath){
      console.log('updateUserPath');
      var updateDeferred = new $.Deferred();
      // @TODO: Here we would submit the path to the persistence service.
      // For now, we fake a service call.
      var serviceDeferred = new $.Deferred();
      setTimeout(function() {
        // @TODO:
        // Eventually this would be a json object, from the 
        // persistence service. But for now, we fake it and just
        // pass backbone model.
        var updatedUserPath = userPath;
        serviceDeferred.resolve(updatedUserPath);
      }, 50);

      // Handle the result from the service.
      // @TODO: normally this would be json object, but for now
      // we fake it and receive backbone model.
      serviceDeferred.done(function(updatedUserPath){
        var userPathId = [updatedUserPath.get('userId'), userPath.get('path').get('id')].join(':');
        Musikata.db.userPaths[userPathId] = updatedUserPath;
        // Resolve the update deferred to finish.
        updateDeferred.resolve(updatedUserPath);
      });

      return updateDeferred.promise();
    },

    mergePathAndUserPath: function(path, userPath){
      console.log('mergePathAndUserPath', path, userPath);
      userPath.get('path').visitNodes(function(nodePath, userPathNode){
        if (userPathNode.get('status') === 'completed'){
          var pathNode = path.getNodeByPath(nodePath);
          if (pathNode) {
            pathNode.set('status', 'completed');
          }
        }
      });
    }
  });

  return PathRepository;

});
