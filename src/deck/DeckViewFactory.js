define(function(require){
  var Marionette = require('marionette');

  // @TODO: lotta dependencies here.
  // Look into breaking this down a bit more.
  var ModelFactory = require('musikata.deck/ModelFactory');
  var ViewFactory = require('musikata.deck/ViewFactory');
  var HtmlView = require('musikata.deck/HtmlView');
  var SelectorView = require('musikata.deck/SelectorView');
  var CompositeModel = require('musikata.deck/CompositeModel');
  var CompositeView = require('musikata.deck/CompositeView');
  var DeckModel = require('musikata.deck/DeckModel');
  var SlideModel = require('musikata.deck/SlideModel');
  var ExerciseSlideModel = require('musikata.deck/ExerciseSlideModel');
  var MusikataExerciseRunnerModel = require('musikata.deck/MusikataExerciseRunnerModel');
  var MusikataExerciseRunnerView = require('musikata.deck/MusikataExerciseRunnerView');

  var AudioManager = require('musikata.audioManager/AudioManager');
  var AudioContext = require('musikata.audioManager/AudioContext');

  var FeelTheBeatExerciseView = require('musikata.feelTheBeat/FeelTheBeatExerciseView');


  var DeckViewFactory = function(deckModel) {
    // Save the parent path for the target destination.
    var destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');

    // @TODO: abstract this for general exercises?
    var FeelTheBeatExerciseSlideView = Marionette.Layout.extend({
      template: function(){return '<div class="exercise-region"></div>';},
      attributes: {
        class: 'exercise-slide'
      },
      submissionType: 'automatic',
      regions: {
        exercise: '.exercise-region'
      },
      initialize: function(options){
        this.options = options;
      },
      onRender: function(){
        this.submission = this.model.get('submission');
        this.exerciseView = new FeelTheBeatExerciseView(_.extend({
          model: this.model
        }, this.options.exerciseOptions));
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

    var FeelTheBeatApp = function(options){
      this.options = options;
      var appConfig = options.appConfig;

      /*
      * Setup audioManager.
      */
      this.audioManager = new AudioManager({
        audioContext: AudioContext
      });

      /*
      * Setup factories.
      */

      // Model factory.
      this.modelFactory = new ModelFactory();
      this.modelFactory.addHandler('html', SlideModel);
      this.modelFactory.addHandler('selector', SlideModel);
      this.modelFactory.addHandler('composite', CompositeModel);
      this.modelFactory.addHandler('feelTheBeat', ExerciseSlideModel);

      // View factory.
      this.viewFactory = new ViewFactory();
      this.viewFactory.addHandler('html', function(options){
        return new HtmlView(options);
      });
      this.viewFactory.addHandler('selector', function(options){
        return new SelectorView(options);
      });
      this.viewFactory.addHandler('composite', _.bind(function(options){
        return new CompositeView(
          _.extend({viewFactory: this.viewFactory}, options));
      }, this));

      this.viewFactory.addHandler('feelTheBeat', _.bind(function(options){
        mergedOptions = _.extend({}, options);
        mergedOptions.exerciseOptions = _.extend({
          audioManager: this.audioManager,
        }, mergedOptions.exerciseOptions);
        return new FeelTheBeatExerciseSlideView(mergedOptions);
      }, this));

      /* 
      * Setup models.
      */
      var deckModelOptions = {
        parse: true,
        modelFactory: this.modelFactory
      };
      var introDeckModel = new DeckModel(
        { slides: appConfig.introSlides }, 
        deckModelOptions
      );

      var exerciseDeckModel = new DeckModel(
        { slides: appConfig.exerciseSlides },
        deckModelOptions
      );

      this.runnerModel = new MusikataExerciseRunnerModel({
        introDeck: introDeckModel,
        exerciseDeck: exerciseDeckModel,
        destination: options.destination
      });

      this.runnerView = new MusikataExerciseRunnerView({
        model: this.runnerModel,
        viewFactory: this.viewFactory,
        className: 'app musikata-exercise-deck-runner exercise-deck-frame',
        id: 'content'
      });

      // Route navigation events.
      this.runnerView.on('navigate', function(route){
        if (route === 'dojo'){
          appConfig.goToHome();
        }
        else if (route === 'destination'){
          appConfig.goToHome();
        }
        else if (route === 'feedback'){
          appConfig.goToFeedback();
        }
        else if (route === 'tryAgain'){
          appConfig.tryAgain();
        }
      });

    };

    // Create feelTheBeat app.
    var feelTheBeatApp = new FeelTheBeatApp({
      appConfig: {
        introSlides: [
        ],
        exerciseSlides: [
          {type: 'feelTheBeat', bpm: 90, length: 4, threshold: .4, maxFailedBeats: 1},
        ],
        goToFeedback: function(){
          console.log('goToFeedback');
        },
        goToHome: function(){
          console.log('goToHome');
          Backbone.history.navigate(destination, {trigger: true});
        },
        tryAgain: function(){
          console.log('tryAgain');
          Backbone.history.loadUrl( Backbone.history.fragment );
        }
      }
    });

    // Wire the deck runner.
    var _this = this;
    feelTheBeatApp.runnerView.on('submit', function(){
      // Set attributes to update on UserPath node.
      var submissionResult = feelTheBeatApp.runnerView.model.get('result');
      var nodeUpdates = {};
      if (submissionResult === 'pass'){
        nodeUpdates['status'] = 'completed';
      }

      var userPath = Musikata.db.userPaths['testUser:testPath'];

      // Get the node in the local user path.
      var localNode = userPath.get('path').getNodeByPath(nodePath);
      // Create node if it doesn't exist.
      if (! localNode){
        console.log("create UserPath node");
        localNode = userPath.get('path').createNodeAtPath(nodePath, nodeUpdates);
      }
      // Otherwise update the node.
      else {
        console.log('update UserPath node');
        localNode.set(nodeUpdates);
      }

      // Submit the updated user path to the persistence service.
      var updateUserPromise = _this.updateUserPath(userPath);
      updateUserPromise.done(function(updatedUserPath){
        // Update the normal path.
        var path = Musikata.db.paths[updatedUserPath.get('path').get('id')];
        _this.mergePathAndUserPath(path, updatedUserPath);

        feelTheBeatApp.runnerView.showOutroView();
      });
    });

    return feelTheBeatApp.runnerView;

  }

  return DeckViewFactory;
});
