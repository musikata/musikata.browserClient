define(function(require) { 
  var Marionette = require("marionette");
  var DummyExercise = Marionette.ItemView.extend({
    template: function(){ return '<button>Click for pie</button>'},
    events: {
      'click button':  function () {
        this.model.get('submission').set('result', 'pass');
      }
    }
  });

  return DummyExercise;

});
