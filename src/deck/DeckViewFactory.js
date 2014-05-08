define(function(require){
  var Marionette = require('marionette');
  var Injector = require('../Injector');


  var DeckViewFactory = function(deckModel) {

    // @TODO: these will come from deckModel.
    // But for now hardcoded.
    var introSlides = [];
    var exerciseSlides = [
      {type: 'FeelTheBeat', bpm: 90, length: 4, threshold: .4, maxFailedBeats: 1},
    ];

    // Setup deck models.
    var deckModelFactory = function (attrs, opts) {
      var defaults = {parse: true};
      return Injector.get('DeckModel')(attrs, _.extend(defaults, opts));
    };
    var introDeckModel = deckModelFactory({slides: introSlides});
    var exerciseDeckModel = deckModelFactory({ slides: exerciseSlides });

    // Setup runner model.
    var ExerciseRunnerModel = Injector.get('ExerciseRunnerModel');
    this.runnerModel = new ExerciseRunnerModel({
      introDeck: introDeckModel,
      exerciseDeck: exerciseDeckModel,
      destination: ''
    });

    var runnerView = Injector.get('ExerciseRunnerView')({
      model: this.runnerModel,
      className: 'app musikata-exercise-deck-runner exercise-deck-frame',
      id: 'content'
    });

    // Route navigation events.
    runnerView.on('navigate', function(route){
      if (route === 'dojo'){
        console.log('goToHome');
      }
      else if (route === 'destination'){
        Backbone.history.navigate(destination, {trigger: true});
      }
      else if (route === 'feedback'){
        console.log('goToFeedback');
      }
      else if (route === 'tryAgain'){
        console.log('tryAgain');
        Backbone.history.loadUrl( Backbone.history.fragment );
      }
    });

    // Wire the deck runner.
    runnerView.on('submit', function(){
      // Set attributes to update on UserPath node.
      var submissionResult = runnerView.model.get('result');
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

    return runnerView;

    // Save the parent path for the target destination.
    var destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');

  };

  return DeckViewFactory;
});
