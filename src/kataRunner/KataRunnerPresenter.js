define(function(require) {
  var Backbone = require('backbone');


  var KataRunnerPresenter = Backbone.Model.extend({
    defaults: {
      score: 0,
      maxScore: 100,
      level: 0,
      actions: new Backbone.Collection(),
      milestones: new Backbone.Collection(),
      model: new Backbone.Model(),
    },

    start: function() {
      this._showChallenge();
    },

    _showChallenge: function() {
      /* Show a challenge. */
      var challenge = this._getChallenge();

      // Wire the challenge.
      this.listenTo(challenge, 'change:result', this._closeChallenge, this);

      this.set('curChallenge', challenge);
    },

    _getChallenge: function() {
      /* Get a challenge. */
      return new Backbone.Model();
    },

    _closeChallenge: function(challengeModel, challengeResult) {
      if (challengeResult === 'pass') {
        this.set('score', this.get('score') + 10);
      }

      if (this.get('score') > this.get('maxScore')) {
        this._showMilestone();
      } else {
        this._showChallenge();
      }
    },

    _showMilestone: function() {
    },

    _closeMilestone: function() {
      this._updateMilestones();

      if (this._getNumRemainingMilestones() === 0) {
        this._showLevel();
      } else  {
        this._showChallenge();
      }
    },

    _getNumRemainingMilestones: function() {
      return this._remainingMilestones;
    },

    _updateMilestones: function() {
      this._remainingMilestones -= 1;
      return;
    }

  });

  return KataRunnerPresenter;
});
