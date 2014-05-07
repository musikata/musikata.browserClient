define(function(require){

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var setupData = require('./setupData');
  var Handlebars = require('handlebars');

  var DojoHomeRouter = require('./dojoHome/DojoHomeRouter');
  var LoginController = require('./auth/LoginController');
  var PathsRouter = require('./paths/PathsRouter');
  

  // @TODO: testing w/ hardcoded data. Take this out later.
  setupData();

  // Create the app object.
  var app = new Marionette.Application();

  // Set up Dojo home routes.
  app.addInitializer(function(options){
    var dojoHomeRouter = new DojoHomeRouter();
  });

  // Setup auth.
  app.loginController = new LoginController();
  app.on('initialize:after', function() {
    app.loginController.checkLogin();
  });


  // Setup path routes.
  app.addInitializer(function(options){ 
    app.pathsRouter = new PathsRouter();
  });

  // Add content region.
  app.addInitializer(function(options){
    console.log(options);
    app.addRegions({
      content: options.contentRegion
    });
  });

  // Start Backbone history to kick off routing.
  app.on("initialize:after", function(options){
    Backbone.history.start({
      root: window.location.pathname
    });
  });

  return app;

});
