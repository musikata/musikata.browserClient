define(function(require){ 
  var _ = require('underscore');


  var LocalStorageBackend = function(opts) {
    this.storageKey = opts.storageKey;
    this.entityTypes = opts.entityTypes;
  };

  _.extend(LocalStorageBackend.prototype, {
    generateId: function() {
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    getEntityKey: function(opts) {
      return [this.storageKey, opts.entityType, opts.entityId].join(':');
    },

    getRawEntity: function(opts) {
      return localStorage[this.getEntityKey(opts)];
    },

    putRawEntity: function(opts, data) {
      localStorage[this.getEntityKey(opts)] = data;
    },

    get: function(opts) {
      var dfd = new $.Deferred();
      var rawEntity = this.getRawEntity(opts);
      if (_.isUndefined(rawEntity)){
        dfd.reject();
      } else {
        dfd.resolve(JSON.parse(rawEntity));
      }
      return dfd.promise();
    },

    post: function(opts) {
      var dfd = new $.Deferred();
      opts.data.id = this.generateId();
      opts.id = opts.data.id;
      this.put(opts);
      return dfd.promise();
    },

    put: function(opts) {
      var dfd = new $.Deferred();
      this.putRawEntity(opts, JSON.stringify(opts.data));
      return dfd.promise();
    }
  });

  return LocalStorageBackend;
});
