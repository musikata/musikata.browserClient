define(function(require) {

  var _ = require('underscore');

  describe('MusikataClientApp', function(){
    var MusikataClientApp = require('musikata_browser_client/MusikataClientApp');

    it('should be defined', function() {
      expect(MusikataClientApp).toBeDefined();
    })

    xdescribe("when path route is triggered", function(){
      it("should fire show_path function", function(){
        this.fail('NOT IMPLEMENTED');
      });
    });

    describe("showPathNode", function(){
      var app;

      // Mock path object.
      var Path = function(data){
        this.data = data;
      };
      _.extend(Path.prototype, {
        // For now, just return dummy node.
        getNodeByPath: function(nodePath){
          return {id: 'dummyNode', type: 'foo'};
        }
      });

      var testPath = new Path({
        id: 'testPath',
        children: [
          {
            id: 'A',
            children: [
              {
                id: 'A.A',
                type: 'foo'
              }
            ]
          }
        ]
      });

      beforeEach(function(){
        app = new MusikataClientApp();
        app.setPaths({
          'testPath': testPath
        });
      });

      it("should show view for specified node", function(){
        var pathId = 'testPath';
        var nodePath = '/A/A.A';
        app.showPathNode(pathId, nodePath);
        var mainView = app.mainView;
        expect(mainView.currentView.$el.html()).toContain('foo');
      });
    });

  });
});
