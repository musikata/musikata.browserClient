define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var PouchDB = require('pouchdb');


  var PouchDbUserPathBackend = function(opts) {
    opts = opts || {};
    this.dbId = 'UserPathNodes';
    if (opts.replace) {
      this.truncateDb();
    }
    this._db = new PouchDB(this.dbId);
  };

  _.extend(PouchDbUserPathBackend.prototype, {

    truncateDb: function() {
      PouchDB.destroy(this.dbId);
      this._db = new PouchDB(this.dbId);
    },

    _getUserPathNodeId: function(opts) {
      return [opts.userId, opts.pathId, opts.nodeXPath].join(':');
    },

    putUserPathNode: function(opts) {
      return this._db.put(opts.node);
    },

    getUserPathNodes: function(opts) {
      var dfd = new $.Deferred();

      var userId = opts.userId;
      var pathId = opts.pathId;

      this._db.allDocs({include_docs: true}).then(function (result) {

        var nodes = [];
        _.each(result.rows, function(row) {
          var node = row.doc;
          if ((node.userId === userId) && (node.pathId === pathId)){
            nodes.push(row.doc);
          }
        });

        dfd.resolve(nodes);
      }).catch(dfd.reject);

      return dfd.promise();
    },

    getUserPath: function(opts) {
      /* Assemble UserPath from component nodes */
      var dfd = new $.Deferred();

      var idParts = opts.id.split(':');
      var userId = idParts[0];
      var pathId = idParts[1];

      this.getUserPathNodes({userId: userId, pathId: pathId})
      .then(function (nodes) {
        try{
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

        } catch (err) { dfd.reject(err) }

      }).fail(dfd.reject);

      return dfd.promise();
    },

    putUserPath: function(userPath) {
      /* Break down path into component nodes */
      var dfd = new $.Deferred();
      var processedNodes = [];

      // Queue up root node first.
      var rootNode = userPath.path;
      rootNode.xPath = '/';
      var queuedNodes = [rootNode];

      // Iteratively process child nodes.
      while (queuedNodes.length) {
        var node = queuedNodes.pop();
        if (node.children) {
          node.children.forEach(function (childNode, idx) {
            if (node.xPath === '/') {
              childNode.xPath = '/' + idx;
            } else {
              childNode.xPath = [node.xPath, idx].join('/');
            }
            queuedNodes.push(childNode);
          });
        }
        node.pathId = rootNode.id;
        node.userId = userPath.userId;
        node._id = this._getUserPathNodeId({userId: userPath.userId, 
          nodeXPath: node.xPath, pathId: node.pathId});
        processedNodes.push(node);
      }
      rootNode.xPath = '/';

      this._db.bulkDocs({docs: processedNodes})
      .then(dfd.resolve).catch(dfd.reject);

      return dfd.promise();
    },

    deleteUserPath: function(opts) {
      var _this = this;
      var dfd = new $.Deferred();

      var idParts = opts.id.split(':');
      var userId = idParts[0];
      var pathId = idParts[1];

      this.getUserPathNodes({userId: userId, pathId: pathId})
      .then(function (nodes) {
        _.each(nodes, function (node) {
          node._deleted = true;
        });

        _this._db.bulkDocs({docs: nodes})
        .then(dfd.resolve).catch(dfd.reject);

      }).fail(dfd.reject);

      return dfd.promise();
    },
  });

  return PouchDbUserPathBackend;

});
