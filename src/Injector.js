/*
 * Create and configure an IOC Injection container.
 */
define(function(require){
  var _ = require('underscore');
  var infect = require('infect');

  var Injector = infect;

  // Util to reduce boilerplate.
  // injectionDef is an array that has keys for injectables
  // as leading members, and function to inject as final member.
  Injector.setAndInject = function(key, injectionDef) {
    var keysForInjectables = injectionDef.slice(0, injectionDef.length - 1);
    var funcToInject = injectionDef[injectionDef.length - 1];
    var injectedFunc = Injector.func(funcToInject);
    injectedFunc.$infect = keysForInjectables;
    Injector.set(key, injectedFunc);
  }


  // Models

  // ModelFactory
  var ModelFactory = require('./ModelFactory');
  Injector.set('ModelFactory', new ModelFactory(Injector));

  // DeckModel
  var DeckModel = require('musikata.deck/DeckModel');
  Injector.setAndInject('DeckModel', 
    ['ModelFactory', function (attrs, opts, $ModelFactory) {
      return new DeckModel(attrs, _.extend({modelFactory: $ModelFactory}, opts));
    }]);

  // FeelTheBeatModel
  var ExerciseSlideModel = require('musikata.deck/ExerciseSlideModel');
  Injector.set('FeelTheBeatModel', ExerciseSlideModel);

  // ExerciseDeckRunnerModel
  var MusikataExerciseRunnerModel = require('musikata.deck/MusikataExerciseRunnerModel');
  Injector.set('ExerciseRunnerModel', MusikataExerciseRunnerModel);


  // Views
  
  // ViewFactory
  var ViewFactory = require('./ViewFactory');
  Injector.set('ViewFactory', new ViewFactory(Injector));

  // ExerciseRunnerView
  var MusikataExerciseRunnerView = require('musikata.deck/MusikataExerciseRunnerView');
  Injector.setAndInject('ExerciseRunnerView', 
    ['ViewFactory', function (opts, $ViewFactory) {
      return new MusikataExerciseRunnerView(_.extend(
      {viewFactory: $ViewFactory}, opts));
    }]);

  // FeelTheBeatView
  var FeelTheBeatView = require('musikata.feelTheBeat/FeelTheBeatExerciseView');
  Injector.setAndInject('FeelTheBeatView', ['AudioManager', 
    function (opts, $AudioManager) {
      var mergedOpts = _.extend({audioManager: new $AudioManager()}, opts);
      return new FeelTheBeatView(mergedOpts);
    }]);

  // ExerciseSlideView
  var ExerciseSlideView = require('./ExerciseSlideView');
  Injector.setAndInject('ExerciseSlideView', ['ViewFactory',
    function (opts, $ViewFactory) {
      return new ExerciseSlideView(_.extend({viewFactory: $ViewFactory}, opts));
    }]);

  // HtmlView
  var HtmlView = require('musikata.deck/HtmlView');
  Injector.set('HtmlView', HtmlView);

  // CompositeView
  var CompositeView = require('musikata.deck/CompositeView');
  Injector.setAndInject('CompositeView', ['ViewFactory', 
    function (opts, $ViewFactory) {
      return new CompositeView(_.extend({viewFactory: $ViewFactory}, opts));
    }]);


  // Audio
  
  // AudioContext
  var AudioContext = require('musikata.audioManager/AudioContext');
  Injector.set('AudioContext', AudioContext); 
  
  // AudioManager
  var AudioManager = require('musikata.audioManager/AudioManager');
  Injector.setAndInject('AudioManager', ['AudioContext',
    function ($AudioContext) {
      return new AudioManager({audioContext: $AudioContext});
    }]);


  return Injector;

});
