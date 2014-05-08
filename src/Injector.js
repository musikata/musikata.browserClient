/*
 * Create and configure an IOC Injection container.
 */
define(function(require){
  var _ = require('underscore');
  var infect = require('infect');

  var Injector = infect;

  // ModelFactory.
  var ModelFactory = require('./ModelFactory');
  Injector.set('ModelFactory', new ModelFactory(Injector));

  // DeckModel.
  var DeckModel = require('musikata.deck/DeckModel');
  var InjectedDeckModel = Injector.func(function (attrs, opts, $ModelFactory) {
    return new DeckModel(attrs, _.extend({modelFactory: $ModelFactory}, opts));
  });
  InjectedDeckModel.$infect = ['ModelFactory'];
  Injector.set('DeckModel', InjectedDeckModel);

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
  InjectedRunnerView = Injector.func(function (opts, $ViewFactory) {
    return new MusikataExerciseRunnerView(_.extend(
      {viewFactory: $ViewFactory}, opts));
  });
  InjectedRunnerView.$infect = ['ViewFactory'];
  Injector.set('ExerciseRunnerView', InjectedRunnerView);

  // FeelTheBeatView
  var FeelTheBeatView = require('musikata.feelTheBeat/FeelTheBeatExerciseView');
  var InjectedFeelTheBeatView = Injector.func(
    function (opts, $AudioManager) {
      var mergedOpts = _.extend({audioManager: new $AudioManager()}, opts);
      return new FeelTheBeatView(mergedOpts);
    }
  );
  InjectedFeelTheBeatView.$infect = ['AudioManager'];
  Injector.set('FeelTheBeatView', InjectedFeelTheBeatView);

  // ExerciseSlideView
  var ExerciseSlideView = require('./ExerciseSlideView');
  var InjectedExerciseSlideView = Injector.func(function (opts, $ViewFactory) {
    return new ExerciseSlideView(_.extend({viewFactory: $ViewFactory}, opts));
  });
  InjectedExerciseSlideView.$infect = ['ViewFactory'];
  Injector.set('ExerciseSlideView', InjectedExerciseSlideView);


  // Audio
  
  // AudioContext
  var AudioContext = require('musikata.audioManager/AudioContext');
  Injector.set('AudioContext', AudioContext); 
  
  // AudioManager
  var AudioManager = require('musikata.audioManager/AudioManager');
  var InjectedAudioManager = Injector.func(function ($AudioContext) {
    return new AudioManager({audioContext: $AudioContext});
  });
  Injector.set('AudioManager', InjectedAudioManager);


  /*


  // Models
  var SlideModel = require('musikata.deck/SlideModel');
  Injector.register('model:html', SlideModel);
  Injector.register('modelFactory', ModelFactory);

  // Views
  var ViewFactory = require('./ViewFactory');
  var HtmlView = require('musikata.deck/HtmlView');
  var SelectorView = require('musikata.deck/SelectorView');
  var CompositeModel = require('musikata.deck/CompositeModel');
  var CompositeView = require('musikata.deck/CompositeView');
  var ExerciseSlideView = require('./ExerciseSlideView');
  Injector.register('viewFactory', ViewFactory);
  Injector.register('view:html', function(options) {
    return new HtmlView(options);
  });
  Injector.register('view:selector', function(options) {
    return new SelectorView(options);
  });
  Injector.register('view:composite', function(options){
    return new CompositeView(_.extend({
      viewFactory: Injector.get('viewFactory')
    }, options));
  }, this);
  Injector.register('view:ExerciseSlideView', ExerciseSlideView);
  // @TODO: clean this up.
  Injector.register('view:feelTheBeat', function(options){
    var mergedOptions = _.extend({}, options);
    mergedOptions.exerciseOptions = _.extend({
      audioManager: Injector.get('audioManager')
    }, mergedOptions.exerciseOptions);
    return new Injector.get('view:ExerciseSlideView')(mergedOptions);
  }, this);
  Injector.register('view:FeelTheBeatExerciseView', FeelTheBeatExerciseView);
  */

  return Injector;

});
