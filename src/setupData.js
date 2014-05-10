define(function(require){
  var _ = require('underscore');
  var $ = require('jquery');
    
  var PathRepository = require('./paths/PathRepository');
  var fixtures = require('./fixtures');


  var setupData = function() {
    var promise = setupPaths();
    return promise;
  };

  var setupPaths = function(){
    var promises = [];
    var pathRepository = new PathRepository();
    _.each(fixtures.rawUserPaths, function(rawUserPath, userPathId) {
      promises.push(pathRepository.putSerializedUserPath(rawUserPath));
    });
    return $.when.apply($, promises);
  };

  return setupData;
});
