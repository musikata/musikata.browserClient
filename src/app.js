define(function(require){

  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var setupData = require('./setupData');
  var Injector = require('./Injector');

  var LoginController = require('./auth/LoginController');
  var MainController = require('./MainController');


  // Create the app object.
  var app = new Marionette.Application();

  // Add regions.
  app.addInitializer(function(options){
    app.addRegions({
      content: options.contentRegion
    });
  });

  // Set up helper controllers.
  app.addInitializer(function(options){
    app.mainController = new MainController({
      region: app.content
    });
    app.loginController = new LoginController();
  });

  // Set up Dojo home routes.
  app.addInitializer(function(options){
    app.dojoHomeRouter = Injector.get('DojoHomeRouter')();
  });

  // @TODO: add this back in.
  //app.on('initialize:after', function() {
    //app.loginController.checkLogin();
  //});

  // Setup path routes.
  app.addInitializer(function(options){ 
    app.pathsRouter = Injector.get('PathsRouter')();
  });

  // Start Backbone history to kick off routing.
  app.on("initialize:after", function(options){
    // @TODO: testing w/ hardcoded data. Take this out later.
    Backbone.history.start({
      root: window.location.pathname
    });
  });


  // Add convenience func for refreshing db.
  window.mkSetupData = function() {
    setupData().fail(function (err) {
      console.log("error: ", err, err.stack);
    });
  }

  window.loadTestPath = function (pathId) {
    require(['./testPaths/' + pathId], function(testPath) {
      var pathBackend = Injector.get('LocalPathBackend');

      pathBackend.putUserPath({
        userId: 'testUser',
        path: testPath
      })
      .then(function () {
        console.log("loaded '" + pathId + "'.");
      })
      .fail(function (err) {
        console.log("e: ", err, err.stack);
      });
    });
  }

  window.truncatePathDb = function() {
    var pathBackend = Injector.get('LocalPathBackend');
    pathBackend.truncateDb();
  };

  return app;

});
