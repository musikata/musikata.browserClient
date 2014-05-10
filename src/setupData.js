define(function(require){
  var _ = require('underscore');
  var $ = require('jquery');
    
  var PouchDbUserPathBackend = require('./paths/PouchDbUserPathBackend');
  var fixtures = require('./fixtures');


  var setupData = function() {
    var promise = setupPaths();
    return promise;
  };

  var setupPaths = function(){
    var promises = [];
    var pathBackend = new PouchDbUserPathBackend({replace: true});
    _.each(fixtures.rawUserPaths, function(rawUserPath, userPathId) {
      promises.push(pathBackend.putUserPath(rawUserPath));
    });
    return $.when.apply($, promises);
  };

  return setupData;
});
