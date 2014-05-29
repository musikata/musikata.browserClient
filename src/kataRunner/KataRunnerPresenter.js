define(function(require) {
  var Backbone = require('backbone');
  var NestedTypes = require('backbone.nestedTypes');


  var KataRunnerPresenter = NestedTypes.Model.extend({
    defaults: {
      score: 0,
      maxScore: 100,
      actions: Backbone.Collection.extend({
        model: NestedTypes.Model.extend({
          defaults: {
            action: '',
            label: '',
            active: true
          }
        })
      }),
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

      // Set actions.
      this.actions.reset([{action: 'check', label: 'check', active: false}]);

      // Wire the kata.

      // Listen for submission.
      this.listenToOnce(kataView, 'submitted', function() {
        this.actions.at(0).set({label: 'checking', active: true});
      }, this);

      // Listen for evaluation.
      this.listenToOnce(kataView, 'evaluated', function(data) {
        // Update score.
        if (data.result === 'pass') {
          this.score += 10;
        }

        // Update actions.
        this.actions.reset([{action: 'continue', label: 'continue', active: false}]);
      }, this);

      // Close kata on continue.
      this.listenToOnce(this.view, 'action:continue', function() {
        this._closeKata(kataView);
      }, this);

      this.view.setBodyView(kataView);
      this.set('curKataView', kataView);
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
    },

    _closeKata: function(kataModel) {
      console.log('_closeKata');
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
      this._milestones -= 1;

      if (this._milestones === 0) {
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
