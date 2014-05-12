define(function(require){
  var _ = require('underscore');
  var $ = require('jquery');
  var Marionette = require('marionette');

  var UserPathModel = require('./UserPathModel');
  var PouchDbUserPathBackend = require('./PouchDbUserPathBackend');


  var PathRepository = Marionette.Controller.extend({

    constructor: function() {
      this.backend = this.getBackend();

      this._cache = {
        paths: {}
      };

      Marionette.Controller.apply(this);
    },

    getBackend: function () {
      return new PouchDbUserPathBackend();
    },

    getUserPathNode: function(opts) {
      /* Asynchronously get individual user path node. Returns node model. */
      var dfd = new $.Deferred();
      this.getUserPath({userId: opts.userId, pathId: opts.pathId})
      .then(function(userPath) {
        dfd.resolve(userPath.getNodeByXPath(opts.nodeXPath));
      })
      .fail(dfd.reject);

      return dfd.promise();
    },

    getUserPath: function(opts){
      /* Asynchronously get path. Returns path model. */
      var dfd = new $.Deferred();

      var userPathId = this.getUserPathId({userId: opts.userId, 
        pathId: opts.pathId});

      // Fetch path if not cached.
      var cachedPath = this._cache.paths[userPathId];
      if (cachedPath) {
        dfd.resolve(cachedPath);
        return dfd.promise();
      }

      // Otherwise pull data, convert to model, and cache it.
      var _this = this;
      this.fetchRawUserPath(userPathId)
      .then(function (rawUserPath) {
        var userPath = _this.parseUserPath(rawUserPath);
        _this._cache.paths[userPathId] = userPath;
        dfd.resolve(userPath);
      })
      .fail(dfd.reject);

      return dfd.promise();
    },

    putSerializedUserPath: function(serializedUserPath) {
      return this.backend.putUserPath(serializedUserPath);
    },

    getUserPathId: function(opts) {
      return [opts.userId, opts.pathId].join(':');
    },

    fetchRawUserPath: function(userPathId) {
      return this.backend.getUserPath({id: userPathId});
    },

    parseUserPath: function(rawUserPath) {
      /* Convert rawPath to Path node model */
      return new UserPathModel(rawUserPath);
    },

    updateUserPathNode: function(opts) {
      var serializedUserPathNode = this.serializeUserPathNode(opts.node);
      var userPathId = this.getUserPathId(opts);
      return this.backend.putUserPathNode({userPathId: userPathId, 
        nodeXPath: opts.nodeXPath, node: serializedUserPathNode});
    },

    serializeUserPathNode: function(node) {
      var serializedNode = node.toJSON();
      delete serializedNode['children'];
      return serializedNode;
    }

  });

  return PathRepository;

});
