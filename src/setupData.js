define(function(require){
  var _ = require('underscore');
    
  var PathRepository = require('./paths/PathRepository');
  var fixtures = require('./fixtures');


  var setupData = function() {
    /*
    * We assume Musikata global variable exists...for now at least.
    * This is hard-coded test data.
    */
    setupPaths();
    /*
    setupUsers();
    setupUserPaths();
    */
  };

  var setupPaths = function(){
    var pathRepository = new PathRepository();
    _.each(fixtures.rawPaths, function(rawPath, pathId) {
      pathRepository.backend.put({entity: 'path', id: pathId, data: rawPath});
    });
  };

  var setupUsers = function() {
    Musikata.db.users = {
      'testUser': new Backbone.Model({
        id: 'testUser'
      })
    };
  };

  var setupUserPaths = function() {
    Musikata.db.userPaths = {
      'testUser:testPath': new Backbone.Model({
        userId: 'testUser',
        path: new NodeModel({
          id: 'testPath'
        })
      })
    };
  };

  return setupData;
});
