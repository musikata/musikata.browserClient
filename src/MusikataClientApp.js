define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');

  MyApp = new Marionette.Application();

  var MusikataClientApp = Marionette.Application.extend({

    setPaths: function(paths){
      this.paths = paths;
    },

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
      return {
        type: 'foo'
      };
    },

    showView: function(view){
      this.currentView = view;
      return;
    },

  });

  return MusikataClientApp;
});
