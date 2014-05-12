define(function(require){
  var _ = require('underscore');
  var Marionette = require('marionette');


  var ExerciseDeckRunnerFactory = function(injector) {
    this.injector = injector;
  };

  _.extend(ExerciseDeckRunnerFactory.prototype, {

    createView: function(opts) {
      var runnerModel = this.createRunnerModel(opts);
      var runnerView = this.createRunnerView(runnerModel);
      this.bindToRunnerView(runnerView, opts);
      return runnerView;
    },

    createRunnerModel: function(opts) {
      var runnerDef = opts.deckRunnerDefinition;

      // Setup nested deck models.
      var _this = this;
      var deckModelFactory = function (attrs, opts) {
        var defaults = {parse: true};
        return _this.injector.get('DeckModel')(attrs, _.extend(defaults, opts));
      };
      var introSlides = runnerDef.introSlides;
      var introDeckModel = deckModelFactory({slides: introSlides});

      var exerciseSlides = runnerDef.exerciseSlides;
      var exerciseDeckModel = deckModelFactory({ slides: exerciseSlides });


      // Setup runner model.
      var ExerciseRunnerModel = this.injector.get('ExerciseRunnerModel');
      var runnerModel = new ExerciseRunnerModel({
        introDeck: introDeckModel,
        exerciseDeck: exerciseDeckModel,
        destination: opts.destination
      });

      return runnerModel;
    },

    createRunnerView: function (runnerModel) {
      var runnerView = this.injector.get('ExerciseRunnerView')({
        model: runnerModel,
        className: 'app musikata-exercise-deck-runner exercise-deck-frame'
      });

      return runnerView;
    },

    bindToRunnerView: function (runnerView, opts) {
      var _this = this;

      // Bind to runner navigation events.
      runnerView.on('navigate', function(route){
        if (route === 'dojo'){
          Backbone.history.navigate('dojo', {trigger: true});
        }
        else if (route === 'destination'){
          Backbone.history.navigate(opts.destination, {trigger: true});
        }
        else if (route === 'feedback'){
        }
        else if (route === 'tryAgain'){
          Backbone.history.loadUrl( Backbone.history.fragment );
        }
      });

      // Bind to runner submission event.
      runnerView.on('submit', function(){
        _this.onRunnerSubmission(runnerView, opts);
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
