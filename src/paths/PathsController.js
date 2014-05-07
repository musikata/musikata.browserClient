define(function(require){

  var Marionette = require('marionette');

  var PathView = require('musikata.path/PathView');
  var DeckController = require('../deck/DeckController');


  var PathsController = Marionette.Controller.extend({

    initialize: function(){
      console.log("initialize");
      // @TODO MOVE THIS DEPENDENCY OUT?
      this.deckController = new DeckController();
    },

    showPathNode: function(pathId, nodePath) {
      console.log(pathId, nodePath);

      // Get data for node.
      var nodeModel = this.getNodeData(pathId, nodePath);
      console.log(nodeModel);

      // Get view class for node.
      // Hmm...might combine viewType and nodeType, maybe namespacing w/ colons.
      // e.g. path:scrollPath.
      var viewType = nodeModel.get('viewType');
      var nodeType = nodeModel.get('nodeType');

      // Clean this up later. But for now handle deck stuff here.
      if (viewType === 'deck') {
        this.deckController.showDeck(nodeModel);
      } else {
        var nodeViewClass = this.getViewClass(viewType);

        // Create view for node.
        var classNames = [];
        var viewOpts = {
          model: nodeModel,
        };
        if (viewType === 'path') {
          classNames.push('musikata-path');
          if (nodeType === 'scroll'){
            classNames.push('scroll-path');
          }
        }
        _.extend(viewOpts, {
          className: classNames.join(' '),
          id: 'content'
        });
        var nodeView = new nodeViewClass(viewOpts);

        //  Set body class.
        $('body').removeClass('fit-screen');

        // Show the view.
        Musikata.app.content.show(nodeView);
      }

    },

    getNodeData: function(pathId, nodePath){
      var path = Musikata.db.paths[pathId];
      var node = path.getNodeByPath(nodePath);
      return node;
    },

    getViewClass: function(viewClassId) {
      if (viewClassId === 'foo') {
        var FooView = Marionette.ItemView.extend({
          template: function() {return 'foo'; }
        });
        return FooView;
      }
      else if (viewClassId === 'bar') {
        var BarView = Marionette.ItemView.extend({
          template: function() {return 'bar'; }
        });
        return BarView;
      }
      else if (viewClassId === 'path') {
        return PathView;
      }
    },

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
