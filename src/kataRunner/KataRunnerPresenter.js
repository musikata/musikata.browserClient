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
      this._showKata();
    },

    _showKata: function() {
      /* Show a kata. */
      var kata = this._getKata();

      // Wire the kata.
      this.listenTo(kata, 'change:result', this._closeKata, this);
      this.listenTo(kata, 'actions:set', this._setActions, this);

      this.set('curKata', kata);
    },

    _getKata: function() {
      /* Get a kata. */
      return new Backbone.Model();
    },

    _closeKata: function(kataModel, kataResult) {
      if (kataResult === 'pass') {
        this.set('score', this.get('score') + 10);
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
    },

    _closeMilestone: function() {
      this._updateMilestones();

      if (this._remainingMilestones === 0) {
        this._showLevel();
      } else  {
        this._showKata();
      }
    },

    _updateMilestones: function() {
      this._remainingMilestones -= 1;
      return;
    },

    _showLevel: function() {
      console.log('_showLevel');
    },

    _closeLevel: function() {
      this._updateLevel();
    },

    _updateLevel: function() {
    }

  });

  return KataRunnerPresenter;
});
