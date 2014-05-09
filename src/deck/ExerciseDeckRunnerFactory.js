define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');


  var ExerciseDeckRunnerFactory = function(injector) {
    this.injector = injector;
  };

  _.extend(ExerciseDeckRunnerFactory.prototype, {

    createView: function(deckData, opts) {
      var runnerModel = this.createRunnerModel(deckData);
      var runnerView = this.createRunnerView(runnerModel);
      this.bindToRunnerView(runnerView, opts);
      return runnerView;
    },

    createRunnerModel: function(deckData) {
      // @TODO: these will come from deckData.
      // But for now hardcoded.
      var introSlides = [];
      var exerciseSlides = [
        //{modelType: 'FeelTheBeatExerciseModel', bpm: 90, length: 4, threshold: .4, maxFailedBeats: 1},
        {modelType: 'ExerciseModel', type: 'DummyExercise'}
      ];

      // Setup nested deck models.
      var _this = this;
      var deckModelFactory = function (attrs, opts) {
        var defaults = {parse: true};
        return _this.injector.get('DeckModel')(attrs, _.extend(defaults, opts));
      };
      var introDeckModel = deckModelFactory({slides: introSlides});
      var exerciseDeckModel = deckModelFactory({ slides: exerciseSlides });

      // Setup runner model.
      var ExerciseRunnerModel = this.injector.get('ExerciseRunnerModel');
      var runnerModel = new ExerciseRunnerModel({
        introDeck: introDeckModel,
        exerciseDeck: exerciseDeckModel,
        destination: ''
      });

      return runnerModel;
    },

    createRunnerView: function (runnerModel) {
      var runnerView = this.injector.get('ExerciseRunnerView')({
        model: runnerModel,
        className: 'app musikata-exercise-deck-runner exercise-deck-frame',
        id: 'content'
      });

      return runnerView;
    },

    bindToRunnerView: function (runnerView, opts) {

      // Bind to runner navigation events.
      runnerView.on('navigate', function(route){
        if (route === 'dojo'){
          Backbone.history.navigate('dojo', {trigger: true});
        }
        else if (route === 'destination'){
          Backbone.history.navigate(opts.destination, {trigger: true});
        }
        else if (route === 'feedback'){
          console.log('goToFeedback');
        }
        else if (route === 'tryAgain'){
          console.log('tryAgain');
          Backbone.history.loadUrl( Backbone.history.fragment );
        }
      });

      // Bind to runner submission event.
      runnerView.on('submit', function(){
        this.onRunnerSubmission(runnerView, opts);
      }, this);
    },

    onRunnerSubmission: function(runnerView, opts){
      var submissionPromise;

      var submissionResult = runnerView.model.get('result');
      if (opts.submissionHandler) {
        submissionPromsie = opts.submissionHandler(submissionResult);
      }
      $.when(submissionPromise).then(function () {
        runnerView.showOutroView();
      });
    }
  });

  return ExerciseDeckRunnerFactory;
});
