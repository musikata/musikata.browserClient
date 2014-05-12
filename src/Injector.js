/*
 * Create and configure an IOC Injection container.
 */
define(function(require){
  var _ = require('underscore');
  // See https://github.com/amwmedia/infect.js
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

  // Exercise Models
  var ExerciseSlideModel = require('musikata.deck/ExerciseSlideModel');
  Injector.set('FeelTheBeatExerciseModel', ExerciseSlideModel);
  Injector.set('ExerciseSlideModel', ExerciseSlideModel);

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

  // DummyExercise
  var DummyExerciseView = require('./deck/DummyExerciseView');
  Injector.set('DummyExercise', DummyExerciseView);

  // FeelTheBeatExercise
  var FeelTheBeatViewExerciseView = require('musikata.feelTheBeat/FeelTheBeatExerciseView');
  Injector.setAndInject('FeelTheBeatExerciseView', ['AudioManager', 
    function (opts, $AudioManager) {
      var mergedOpts = _.extend({audioManager: new $AudioManager()}, opts);
      return new FeelTheBeatViewExerciseView(mergedOpts);
    }]);

  // ExerciseSlideView
  var ExerciseSlideView = require('./deck/ExerciseSlideView');
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

  // ExerciseRunnerFactory
  var ExerciseDeckRunnerFactory = require('./deck/ExerciseDeckRunnerFactory');
  Injector.set('ExerciseDeckRunnerFactory', 
    new ExerciseDeckRunnerFactory(Injector));


  // Paths
  var PathRepository = require('./paths/PathRepository');
  Injector.set('PathRepository', new PathRepository());

  var PathsController = require('./paths/PathsController');
  Injector.setAndInject('PathsController', ['PathRepository',
    function($PathRepository) {
      return new PathsController($PathRepository);
    }]);

  var PathsRouter = require('./paths/PathsRouter');
  Injector.setAndInject('PathsRouter', ['PathsController',
    function($PathsController) {
      return new PathsRouter({controller: $PathsController()});
    }]);

  var PouchDbUserPathBackend = require('./paths/PouchDbUserPathBackend');
  Injector.set('LocalPathBackend', new PouchDbUserPathBackend());


  // Dojo Home
  var DojoHomeController = require('./dojoHome/DojoHomeController');
  Injector.setAndInject('DojoHomeController', ['PathRepository',
    function($PathRepository) {
      return new DojoHomeController($PathRepository);
    }]);

  var DojoHomeRouter = require('./dojoHome/DojoHomeRouter');
  Injector.setAndInject('DojoHomeRouter', ['DojoHomeController',
    function($DojoHomeController) {
      return new DojoHomeRouter({controller: $DojoHomeController()});
    }]);


  return Injector;

});
