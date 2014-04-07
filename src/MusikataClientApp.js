define(function(require){
  var _ = require('underscore');

  var MusikataClientApp = function(){
    // Dummy db for paths. This will probably change.
    this.paths = {};
  };

  _.extend(MusikataClientApp.prototype, {

    showPathNode: function(pathId, nodePath){
      // Get the path from the db.
      var path = this.paths[pathId];

      // Get the node from the path.
      var node = path.getNodeByPath(nodePath);

      // Create the view for the node.
      var nodeView = this.createViewForNode(node);

      // Show the view.
      this.showView(nodeView);
    },

    createViewForNode: function(node){
      return {};
    },

    showView: function(view){
      return;
    }

  });

  return MusikataClientApp;
});
