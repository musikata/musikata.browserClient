define(function(require){
  var Marionette = require('marionette');


  var PathsController = Marionette.Controller.extend({

    showPathNode: function(pathId, nodePath) {
      var nodeModel = this.getNodeData(pathId, nodePath);
      Musikata.app.mainController.showView(
        nodeModel.get('viewType'), nodeModel);
    },

    getNodeData: function(pathId, nodePath){
      var path = Musikata.db.paths[pathId];
      var node = path.getNodeByPath(nodePath);
      return node;
    },

    // @TODO
    // Will probably want to move this out later...
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
      }, 1000);

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

  return PathsController;

});
