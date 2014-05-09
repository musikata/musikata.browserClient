define(function(require){
  var _ = require("underscore");
  var $ = require('jquery');
  var Marionette = require('marionette');


  var PathsController = Marionette.Controller.extend({

    showPathNode: function(pathId, nodePath) {
      var nodeModel = this.getNodeData(pathId, nodePath);
      var viewType = nodeModel.get('viewType');

      var opts = {};
      if (viewType === 'deck') {
        // Customize options for deck view.

        // Create callback for deck submission.
        opts.submissionHandler = _.bind(function (result) {
          this.onDeckSubmit({
            result: result,
            node: nodeModel,
            pathId: pathId,
            nodePath: nodePath
          });
        }, this);

        // Set destination.
        opts.destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');
      }

      Musikata.app.mainController.showView(
        nodeModel.get('viewType'), nodeModel, opts);
    },

    onDeckSubmit: function(opts) {
      var _this = this;
      // @TODO
      // FAKE IT FOR NOW
      var dfd = new $.Deferred();
      
      var nodeUpdates = {};
      if (opts.result === 'pass'){
        nodeUpdates['status'] = 'completed';
      }

      var userPath = Musikata.db.userPaths['testUser:testPath'];

      // Get the node in the local user path.
      var localNode = userPath.get('path').getNodeByPath(opts.nodePath);

      // Create node if it doesn't exist.
      if (! localNode){
        console.log("create UserPath node");
        localNode = userPath.get('path').createNodeAtPath(opts.nodePath, nodeUpdates);
      }
      // Otherwise update the node.
      else {
        console.log('update UserPath node');
        localNode.set(nodeUpdates);
      }

      // Submit the updated user path to the persistence service.
      var updateUserPromise = this.updateUserPath(userPath);
      updateUserPromise.done(function(updatedUserPath){
        // Update the normal path.
        var path = Musikata.db.paths[updatedUserPath.get('path').get('id')];
        _this.mergePathAndUserPath(path, updatedUserPath);
        dfd.resolve();
      });

      return dfd;
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

  return PathsController;

});
