define(function(require){
  var _ = require("underscore");
  var $ = require('jquery');
  var Marionette = require('marionette');


  var PathsController = Marionette.Controller.extend({

    constructor: function(pathRepository){
      this.pathRepository = pathRepository;
      Marionette.Controller.apply(this);
    },

    showPathNode: function(pathId, nodePath) {
      var nodeModel = this.pathRepository.getNode(
        {pathId: pathId, nodePath: nodePath});

      var viewType = nodeModel.get('viewType');

      var opts = {};
      if (viewType === 'deck') {
        // Create callback for deck submission.
        opts.submissionHandler = _.bind(function (result) {
          this.onDeckSubmit({result: result, node: nodeModel, pathId: pathId,
            nodePath: nodePath});
        }, this);

        // Set destination.
        opts.destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');
      }

      Musikata.app.mainController.showView(
        nodeModel.get('viewType'), nodeModel, opts);
    },

    onDeckSubmit: function(opts) {
      var promise;
      
      var nodeModel = this.pathRepository.getNode(
        {pathId: opts.pathId, nodePath: opts.nodePath});

      if (opts.result === 'pass'){
        nodeModel.set('status', 'completed');
        promise = this.pathRepository.updateNode({node: nodeModel});
      }

      return promise;
    },

  });

  return PathsController;

});
