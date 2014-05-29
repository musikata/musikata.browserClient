define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var NestedTypes = require('backbone.nestedTypes');
  var Marionette = require('marionette');

  var KataRunnerPresenter = require('src/kataRunner/KataRunnerPresenter');
  var KataRunnerView = require('src/kataRunner/KataRunnerView');


  var mockKataViewFactory = {
    getKataView: function() {

      var KataViewModel = Backbone.Model.extend({
        postViewInitialize: function() {
          this.listenTo(this.view, 'submit', this.submit, this);
        },

        submit: function() {
          console.log('submit');
          this.trigger('submitted');
          var _this = this;
          setTimeout(function() {
            console.log('evaluated');
            _this.set('result', 'pass');
            _this.trigger('evaluated');
            _this.view.trigger('evaluated', {result: _this.get('result')});
          }, 500);
        }
      });

      var KataView = Marionette.ItemView.extend({
        events: {'click button': 'onButtonClick' },
        initialize: function() {
          this.model.view = this;
          this.model.postViewInitialize();
        },
        template: function() {return new Date() + '<button>KataView</button>';},
        onButtonClick: function() {
          console.log('onButtonClick');
          this.trigger('submit');
        }
      });

      return new KataView({
        model: new KataViewModel()
      });
    }
  };
  


  var viewModel = new KataRunnerPresenter({
    level: 3,
    milestones: 2,
    maxScore: 20,
    kataViewFactory: mockKataViewFactory,
  });

  var view = new KataRunnerView({el: '#content', model: viewModel});
  window.v = view;

  view.render();
  viewModel.start();

});
