define(function(require){
  var Marionette = require('marionette');
  var Backbone = require('backbone');

  var LoginView = require('./LoginView');


  var LoginController = Marionette.Controller.extend({
    postLoginCredentials: function(credentials, loginView){
      // Fake login service for now.
      // @TODO: replace this w/ service, or event.
      var loginDeferred = new $.Deferred();
      loginDeferred.done(function(data){
        var loginResult = {};
        if (data.status == 200){
          loginResult = {
            status: 'sucess'
          };
          Musikata.session = data.session;
          Backbone.history.navigate('dojo', true);
        }
        else {
          loginResult = {
            status: 'fail',
            error: 'bad username or password'
          };
        }
        loginView.trigger('submission:end', loginResult);
      });

      setInterval(function(){
        var loginResult = {};
        if (credentials.user === 'bob'){
          loginResult = {
            status: 200,
            session: {}
          }
        }
        else {
          loginResult = {
            status: 401
          }
        }
        loginDeferred.resolve(loginResult);
      }, 1000);
    },

    showLoginView: function() {
      var loginView = new LoginView({
        model: new Backbone.Model()
      });
      loginView.on('submission:start', function(credentials) {
        this.postLoginCredentials(credentials, loginView);
      }, this);
      Musikata.app.content.show(loginView);
    },

    checkLogin: function(){
      // Check for authenticated session.
      if (Musikata && Musikata.session) {
        // Show main view.
      }
      else {
        // Show login view.
        Musikata.app.loginController.showLoginView();
      }
    }
  });

  return LoginController;
});
