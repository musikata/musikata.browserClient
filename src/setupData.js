define(function(require){
  var NodeModel = require('musikata.path/NodeModel');

  var setupData = function() {
    /*
    * We assume Musikata global variable exists...for now at least.
    * This is hard-coded test data.
    */
    Musikata.db = {};
    Musikata.rawData = {};
    setupPaths();
    setupUsers();
    setupUserPaths();
  };

  var setupPaths = function(){
    Musikata.rawData.paths = {
      "testPath": {
        id: "testPath",
        title: "Test Path",
        description: "<p>This is a test path</p>",
        viewType: 'path',
        nodeType: 'path',
        children: [
          {
            id: "node_1", 
            title: "Node 1",
            viewType: "path",
            nodeType: "scroll",
            iconClass: "yellow-belt",
            children: [
              {
                id: "node_3", 
                title: "Node 3",
                viewType: "deck",
                nodeType: "deck"
              },
            ]
          },
          {
            id: "node_2",
            title: "Node 2",
            viewType: "path",
            nodeType: "scroll",
            iconClass: "green-belt",
            children: [
              {
                id: "node_4", 
                title: "Node 4",
                viewType: "foo",
                nodeType: "deck"
              },
            ]
          }
        ]
      }
    };

    // Parse path data.
    Musikata.db.paths = {};
    _.each(Musikata.rawData.paths, function(rawPath, pathId){
      Musikata.db.paths[pathId] = new NodeModel(rawPath);
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
