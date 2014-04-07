define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');

  MyApp = new Marionette.Application();

  var MusikataClientApp = Marionette.Layout.extend({

    template: function() {
      return '<div class="main"></div>'
    },

    regions: {
      mainView: '.main'
    },


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

      // A mapping from node types to view types.
      var typesRegistry = {
        foo: 'FooView'
      };

      var ViewClass = this.getViewClass(typesRegistry[node.type]);

      return new ViewClass();
    },

    getViewClass: function(viewClass) {
      // Here is where the actual class loading would happen.
      // This is the bit I need to figure out. How to define which classes are
      // in which bundles.
      var FooView = Marionette.ItemView.extend({
        template: function() {
          return 'foo';
        }
      });

      if (viewClass === 'FooView') {
        return FooView;
      }

    },

    showView: function(view){
      this.mainView.show(view);
      return;
    },

  });

  return MusikataClientApp;
});
