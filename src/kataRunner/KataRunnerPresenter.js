define(function(require) {
  var Backbone = require('backbone');
  var NestedTypes = require('backbone.nestedTypes');


  var KataRunnerPresenter = NestedTypes.Model.extend({
    defaults: {
      score: 0,
      maxScore: 100,
      actions: Backbone.Collection,
      level: 2,
      milestones: 3,
      milestonesPerLevel: 3
    },

    setView: function(view) {
      this.view = view;
    },

    start: function() {
      this._showKata();
    },

    _showKata: function() {
      /* Show a kata. */
      var kataView = this._getKataView();

      // Wire the kata.
      this.listenTo(kataView.model, 'change:result', this._closeKata, this);
      this.listenTo(kataView, 'actions:set', this._setActions, this);

      this.view.body.show(kataView);
      this.set('curKata', kataView);
    },

    _getKataView: function() {
      /* Get a kata view. */
      // @TODO: get view via factory.
      var Marionette = require('marionette');

      var KataViewModel = Backbone.Model.extend({
        postViewInitialize: function() {
          this.listenTo(this.view, 'submit', this.submit, this);
        },

        submit: function() {
          console.log('submit');
          this.trigger('submit');
          var _this = this;
          setTimeout(function() {
            console.log('evaluated');
            _this.set('result', 'pass');
            _this.trigger('evaluated');
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
    },

    _closeKata: function(kataModel, kataResult) {
      console.log('_closeKata');
      if (kataResult === 'pass') {
        this.score += 10;
      }

      if (this.get('score') > this.get('maxScore')) {
        this._showMilestone();
      } else {
        this._showKata();
      }
    },

    _setActions: function(newActions) {
      this.get('actions').reset(newActions);
    },

    _showMilestone: function() {
      console.log('_showMilestone');

      // @TODO: get milestone view via factory.
      var Marionette = require('marionette');

      var MilestoneViewModel = Backbone.Model.extend({
        postViewInitialize: function() {
          this.listenTo(this.view, 'submit', function() {
            this.trigger('submit');
          }, this);
        }
      });

      var MilestoneView = Marionette.ItemView.extend({
        events: {'click button': 'onButtonClick' },
        initialize: function() {
          this.model.view = this;
          this.model.postViewInitialize();
        },
        template: function() {return new Date() + '<h3>Milestone</h3><button>submit</button>';},
        onButtonClick: function() {
          console.log('onMilestoneButtonClick');
          this.trigger('submit');
        }
      });

      var milestoneView = new MilestoneView({
        model: new MilestoneViewModel()
      });

      this.view.body.show(milestoneView);
      this.listenTo(milestoneView.model, 'submit', this._closeMilestone, this);
    },

    _closeMilestone: function() {
      console.log('_closeMilestone');
      this.milestones -= 1;

      if (this.milestones === 0) {
        this._showLevel();
      } else  {
        this.score = 0;
        this._showKata();
      }
    },

    _showLevel: function() {
      console.log('_showLevel');

      // @TODO: get level view via factory.
      var Marionette = require('marionette');

      var LevelViewModel = Backbone.Model.extend({
        postViewInitialize: function() {
          this.listenTo(this.view, 'submit', function() {
            this.trigger('submit');
          }, this);
        }
      });

      var LevelView = Marionette.ItemView.extend({
        events: {'click button': 'onButtonClick' },
        initialize: function() {
          this.model.view = this;
          this.model.postViewInitialize();
        },
        template: function() {return new Date() + '<h2>Level</h2><button>submit</button>';},
        onButtonClick: function() {
          console.log('onLevelButtonClick');
          this.trigger('submit');
        }
      });

      var levelView = new LevelView({
        model: new LevelViewModel()
      });

      this.view.body.show(levelView);
      this.listenTo(levelView.model, 'submit', this._closeLevel, this);
    },

    _closeLevel: function() {
      this.level += 1;
      this.milestones = this.milestonesPerLevel;
      this.score = 0;
      this._showKata();
    },

  });

  return KataRunnerPresenter;
});
