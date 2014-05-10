define(function(require){
  var _ = require("underscore");
  var $ = require('jquery');
  var Marionette = require('marionette');


  var PathsController = Marionette.Controller.extend({

    constructor: function(pathRepository){
      this.pathRepository = pathRepository;
      Marionette.Controller.apply(this);
    },

    showPathNode: function(pathId, nodeXPath) {
      /* Show vide for node by dispatching on view type */
      console.log('spn');
      var _this = this;
      this.pathRepository.getUserPathNode({userId: 'testUser', pathId: pathId,
        nodeXPath: nodeXPath})
      .then(function(node) {
        console.log('n is: ', node);
        var viewType = node.get('viewType');

        var opts = {};
        if (viewType === 'deck') {
          // Create callback for deck submission.
          opts.submissionHandler = function (result) {
            _this.onDeckSubmit({result: result, node: node, pathId: pathId,
              nodeXPath: nodeXPath});
          };

          // Set destination to be parent node.
          opts.destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');
        }

        Musikata.app.mainController.showView({viewType: node.get('viewType'),
          model: node, opts: opts});
      });
    },

    onDeckSubmit: function(opts) {
      /* Update path node when deck submission is complete */
      var _this = this;
      var promise;
      
      this.pathRepository.getUserPathNode({userId: 'testUser', 
        pathId: opts.pathId, nodeXPath: opts.nodeXPath})
      .then(function(node) {
        if (opts.result === 'pass'){
          node.set('status', 'completed');
          promise = _this.pathRepository.updateUserPathNode({
            userId: 'testUser', pathId: opts.pathId, nodeXPath: opts.nodeXPath,
            node: node});
        }
      });

      return promise;
    },

  });

  return PathsController;

});
