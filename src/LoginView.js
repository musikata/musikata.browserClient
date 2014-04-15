define(function(require){
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  
  var LoginViewTemplate = require('text!./templates/LoginView.html')

  var LoginView = Marionette.ItemView.extend({
    tagName: 'form',
    className: 'login-form',
    template: Handlebars.compile(LoginViewTemplate),
    ui: {
      user: '[name="user"]',
      password: '[name="password"]',
      loginButton: '.login-button',
      statusMessage: '.status-message'
    },

    events: {
      'click @ui.loginButton': 'onClickLoginButton'
    },

    initialize: function(){
      this.on('submission:end', this.onSubmissionEnd, this);
    },

    onClickLoginButton: function(){
      this.ui.statusMessage.hide();
      this.trigger('submission:start', this.model.toJSON());
      this.ui.loginButton.prop('disabled', true);
    },
    
    onSubmissionEnd: function(result){
      if (result.status == 'fail'){
        this.ui.statusMessage.html(result.error);
        this.ui.statusMessage.addClass('warning');
        this.ui.statusMessage.show();
      }
      this.ui.loginButton.prop('disabled', false);
    }

  });

  return LoginView;
});
