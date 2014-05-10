define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var PouchDB = require('pouchdb');


  var PouchDbUserPathBackend = function(opts) {
    opts = opts || {};
    this.dbId = 'UserPathNodes';
    if (opts.replace) {
      PouchDB.destroy(this.dbId);
    }
    this._db = new PouchDB(this.dbId);
  };

  _.extend(PouchDbUserPathBackend.prototype, {

    destroyDb: function() {
    },

    _getUserPathNodeId: function(opts) {
      return [opts.userId, opts.pathId, opts.nodeXPath].join(':');
    },

    putUserPathNode: function(opts) {
      this._db.put(opts.node);
    },

    getUserPath: function(opts) {
      /* Assemble UserPath from component nodes */
      var dfd = new $.Deferred();

      var idParts = opts.id.split(':');
      var userId = idParts[0];
      var pathId = idParts[1];

      this._db.allDocs({include_docs: true}).then(function (result) {
        var nodes = [];

        _.each(result.rows, function(row) {
          nodes.push(row.doc);
        });

        var sortedNodes = _.sortBy(nodes, 'xPath');

        // Initialize path tree lookup with root node.
        var rootNode = sortedNodes[0];
        rootNode.children = [];
        var xPathLookup = {'/': rootNode};

        // Iteratively add component nodes to tree.
        for (var i=1; i < sortedNodes.length; i++) {
          var node = sortedNodes[i];
          var parentXPath = node.xPath.replace(/(.*)\/.*/, '$1') || '/';
          var parentNode = xPathLookup[parentXPath];
          parentNode.children.push(node);
          node.children = [];
          xPathLookup[node.xPath] = node;
        }

        var userPath = {userId: userId, path: rootNode};
        dfd.resolve(userPath);
        return;
      }).catch(function (err) {
        dfd.reject(err);
        return;
      });

      return dfd.promise();
    },

    putUserPath: function(userPath) {
      /* Break down path into component nodes */
      var dfd = new $.Deferred();
      var processedNodes = [];

      // Queue up root node first.
      var rootNode = userPath.path;
      rootNode.xPath = '';
      var queuedNodes = [rootNode];

      // Iteratively process child nodes.
      while (queuedNodes.length) {
        var node = queuedNodes.pop();
        if (node.children) {
          node.children.forEach(function (childNode, idx) {
            childNode.xPath = [node.xPath, idx].join('/');
            queuedNodes.push(childNode);
          });
        }
        node.pathId = rootNode.id;
        node.userId = userPath.userId;
        processedNodes.push(node);
      }
      rootNode.xPath = '/';

      this._db.bulkDocs({docs: processedNodes}).then(dfd.resolve).catch(dfd.fail);

      return dfd.promise();
    }
  });

  return PouchDbUserPathBackend;

});
