define(function(require){
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var PathView = require('musikata.path/PathView');

  // Create the app object.
  var app = new Marionette.Application();

  // Add routing for paths.
  app.addInitializer(function(options){

    var PathController = Marionette.Controller.extend({
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
        var nodeViewClass = this.getViewClass(viewType);

        // Create view for node.
        var viewOpts = {
          model: nodeModel
        };
        if (viewType === 'path') {
          var classNames = ['musikata-path'];
          if (nodeType === 'scroll'){
            classNames.push('scroll-path');
          }
          _.extend(viewOpts, {
            className: classNames.join(' ')
          });
        }
        var nodeView = new nodeViewClass(viewOpts);

        // Show the view.
        app.main.show(nodeView);

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
      }
    });

    var pathsRouter = new Marionette.AppRouter({
      appRoutes: {
        "path/:pathId/*nodePath": "showPathNode"
      },
      controller: new PathController()
    });
    
  });

  // Define service for generating views.

  // Add main region.
  app.addInitializer(function(options){
    console.log(options);
    app.addRegions({
      main: options.mainRegion
    });
  });

  // Start Backbone history to kick off routing.
  app.on("initialize:after", function(options){
    Backbone.history.start();
  });

  return app;

});
