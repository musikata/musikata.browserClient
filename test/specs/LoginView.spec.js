define(function(require){
  describe('LoginView', function(){
    var Backbone = require('backbone');
    var LoginView = require('musikata.browser_client/LoginView');

    it('should be defined', function(){
      expect(LoginView).toBeDefined();
    });

    describe('after rendering', function(){
      var view;

      beforeEach(function(){
        view = new LoginView({
          model: new Backbone.Model({
            user: 'testUser',
            password: 'testPassword'
          })
        });
        view.render();
      });

      afterEach(function(){
        view.remove();
      });

      it('should have input elements', function(){
        var expectedFormElements = ['user', 'password'];
        for (var i=0; i < expectedFormElements.length; i++) {
          var formElementName = expectedFormElements[i];
          var $formEl = view.ui[formElementName];
          expect($formEl.length).toEqual(1);
        }
      });
      
      it('should have "login" button', function(){
        expect(view.ui.loginButton.length).toEqual(1);
      });

      describe('after clicking login button', function(){
        it('should trigger submission:start event w/ form data', function(){
          var expectedLoginData = {
            user: 'testUser',
            password: 'testPassword'
          };

          var actualLoginData;
          view.on('submission:start', function(loginData){
            actualLoginData = loginData;
          });
          view.ui.loginButton.trigger('click');

          expect(expectedLoginData).toEqual(actualLoginData);
        });

        it('should disable login button', function(){
          view.ui.loginButton.trigger('click');
          expect(view.ui.loginButton.prop('disabled')).toBe(true);
        });
      });

      describe('when submission:end event is triggered', function(){
        describe('when submission result is fail', function(){
          it('should show the failure message', function(){
            view.trigger('submission:end', {status: 'fail', error: 'badness'});
            expect(view.ui.statusMessage.html()).toContain('badness');
          });

          it('should enable login button', function(){
            view.ui.loginButton.prop('disabled', true);
            view.trigger('submission:end', {status: 'fail', error: 'badness'});
            expect(view.ui.loginButton.prop('disabled')).toBe(false);
          });
        });
      });
    });

  });
});
