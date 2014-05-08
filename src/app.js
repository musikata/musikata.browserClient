define(function(require){

  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var setupData = require('./setupData');

  var LoginController = require('./auth/LoginController');
  var MainController = require('./MainController');

  var DojoHomeRouter = require('./dojoHome/DojoHomeRouter');
  var PathsRouter = require('./paths/PathsRouter');
  

  // @TODO: testing w/ hardcoded data. Take this out later.
  setupData();

  // Create the app object.
  var app = new Marionette.Application();

  // Add regions.
  app.addInitializer(function(options){
    console.log(options);
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
    var dojoHomeRouter = new DojoHomeRouter();
  });

  // @TODO: add this back in.
  //app.on('initialize:after', function() {
    //app.loginController.checkLogin();
  //});

  // Setup path routes.
  app.addInitializer(function(options){ 
    app.pathsRouter = new PathsRouter();
  });

  // Start Backbone history to kick off routing.
  app.on("initialize:after", function(options){
    Backbone.history.start({
      root: window.location.pathname
    });
  });

  return app;

});
