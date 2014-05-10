define(function(require) {
  var Backbone = require('backbone');
  var NodeModel = require('musikata.path/NodeModel');

  
  var UserPathModel = Backbone.Model.extend({
    initialize: function(attrs, opts) {
      // Create path model from raw path.
      var path = this.get('path');
      if (! (path instanceof NodeModel)) {
        var pathModel = new NodeModel(path);
        this.set('path', pathModel);
      }
    },

    getNodeByXPath: function(nodeXPath) {
      return this.get('path').getNodeByXPath(nodeXPath);
    }
  });

  return UserPathModel;

});
