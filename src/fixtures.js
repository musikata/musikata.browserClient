define(function(require) {
  var fixtures = {};

  // Raw Paths.
  fixtures.rawPaths = {
    "testPath": {
      id: "testPath",
      title: "Test Path",
      description: "<p>This is a test path</p>",
      icon: 'drum',
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

  return fixtures;

});
