define(function(require){
  var _ = require('underscore');
  var $ = require('jquery');
  var Marionette = require('marionette');

  var NodeModel = require('musikata.path/NodeModel');
  var LocalStorageBackend = require('./LocalStorageBackend');


  var PathRepository = Marionette.Controller.extend({

    constructor: function() {
      this.backend = this.getBackend();

      this._cache = {
        paths: {}
      };

      Marionette.Controller.apply(this);
    },

    getBackend: function () {
      return new LocalStorageBackend({storageKey: 'musikata.paths', 
        entityType: ['path']});
    },

    getNode: function(opts) {
      var dfd = new $.Deferred();
      this.getPath({pathId: opts.pathId})
      .then(function(path) {
        dfd.resolve(path.getNodeByPath(opts.nodePath));
      });
      return dfd.promise();
    },

    getPath: function(opts){
      /* Asynchronously get path. Returns path model. */
      var dfd = new $.Deferred();

      // Return cached path if it exists.
      var cachedPath = _.has(this._cache.paths, opts.pathId);
      if (cachedPath) {
        dfd.resolve(cachedPath);
        return dfd.promise();
      }

      // Otherwise pull data and convert to model.
      var _this = this;
      this.fetchRawPath(opts.pathId)
      .then(function (rawPath) {
        dfd.resolve(_this.parsePath(rawPath));
      });

      return dfd.promise();
    },

    fetchRawPath: function(pathId) {
      return this.backend.get({entity: 'path', id: pathId})
    },

    parsePath: function(rawPath) {
      /* Convert rawPath to Path node model */
      return new NodeModel(rawPath);
    },

    updateNode: function(opts) {
      console.log('update node');
    },

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

  return PathRepository;

});
