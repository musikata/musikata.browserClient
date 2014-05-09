define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');

  var ExerciseSlideView = Marionette.Layout.extend({
    template: function(){return '<div class="exercise-region"></div>';},
    className: 'exercise-slide',
    submissionType: 'automatic',
    regions: {
      exercise: '.exercise-region'
    },
    initialize: function(options){
      this.options = options;
      this.viewFactory = options.viewFactory;
    },
    onRender: function(){
      this.submission = this.model.get('submission');
      this.exerciseView = this.viewFactory.createView(_.extend(
        {model: this.model}, this.options.exerciseOptions));
      this.exercise.show(this.exerciseView);

      // Wire exercise events.
      this.listenTo(this.exerciseView, 'submission:start', function(){
        this.submission.set('state', 'submitting');
      }, this)

      this.listenTo(this.exerciseView, 'submission:end', function(evaluatedSubmission){
        this.submission.set({
          data: evaluatedSubmission,
          result: evaluatedSubmission.result
        });
        this.submission.set('state', 'completed');
      }, this)
    }
  });

  return ExerciseSlideView;
});
