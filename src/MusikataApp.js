define(function(require){
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var setupData = require('./setupData');
  var Handlebars = require('handlebars');

  var PathView = require('musikata.path/PathView');
  var LoginView = require('./LoginView');
  var DojoHomeView = require('./DojoHomeView');

  // @TODO: testing w/ hardcoded data. Take this out later.
  setupData();

  // Create the app object.
  var app = new Marionette.Application();

  // Dojo view stuff.
  app.addInitializer(function(options){
    var DefaultRouter = new Marionette.AppRouter({
      appRoutes: {
        'dojo': 'showDojoHome'
      },
      controller: {
        showDojoHome: function(){
          var dojoHomeView = new DojoHomeView();
          app.content.show(dojoHomeView);
        }
      }
    });
  });

  // Add login stuff.
  app.addInitializer(function(options){
    var LoginController = Marionette.Controller.extend({

      postLoginCredentials: function(credentials, loginView){
        console.log('postLoginCredentials', credentials);
        // Fake login service for now.
        // @TODO: replace this w/ service, or event.
        var loginDeferred = new $.Deferred();
        loginDeferred.done(function(data){
          var loginResult = {};
          if (data.status == 200){
            loginResult = {
              status: 'sucess'
            };
            console.log('login success');
            Musikata.session = data.session;
            console.log('show dojo home');
            Backbone.history.navigate('dojo', true);
          }
          else {
            loginResult = {
              status: 'fail',
              error: 'bad username or password'
            };
          }
          loginView.trigger('submission:end', loginResult);
        });

        setInterval(function(){
          var loginResult = {};
          if (credentials.user === 'bob'){
            loginResult = {
              status: 200,
              session: {}
            }
          }
          else {
            loginResult = {
              status: 401
            }
          }
          loginDeferred.resolve(loginResult);
        }, 1000);
      },

      showLoginView: function() {
        var loginView = new LoginView({
          model: new Backbone.Model()
        });
        loginView.on('submission:start', function(credentials) {
          this.postLoginCredentials(credentials, loginView);
        }, this);
        app.content.show(loginView);
      }
    });

    app.loginController = new LoginController();
  });

  app.on('initialize:after', function() {
    // Check for authenticated session.
    if (Musikata && Musikata.session) {
      // Show main view.
      console.log('show main view');
    }
    else {
      // Show login view.
      app.loginController.showLoginView();
    }
  });


  // Add routing for paths.
  app.addInitializer(function(options){

    var PathController = Marionette.Controller.extend({
      showPathNode: function(pathId, nodePath) {
        console.log(pathId, nodePath);
        // Get data for node.
        var nodeModel = this.getNodeData(pathId, nodePath);
        console.log(nodeModel);
        // Get view class for node.
        // Hmm...might combine viewType and nodeType, maybe namespacing w/ colons.
        // e.g. path:scrollPath.
        var viewType = nodeModel.get('viewType');
        var nodeType = nodeModel.get('nodeType');
        
        // Clean this up later. But for now handle deck stuff here.
        if (viewType === 'deck') {
          this.showDeckNode(nodeModel, pathId, nodePath);
        } else {
          var nodeViewClass = this.getViewClass(viewType);

          // Create view for node.
          var classNames = [];
          var viewOpts = {
            model: nodeModel,
          };
          if (viewType === 'path') {
            classNames.push('musikata-path');
            if (nodeType === 'scroll'){
              classNames.push('scroll-path');
            }
          }
          _.extend(viewOpts, {
            className: classNames.join(' '),
            id: 'content'
          });
          var nodeView = new nodeViewClass(viewOpts);

          //  Set body class.
          $('body').removeClass('fit-screen');

          // Show the view.
          app.content.show(nodeView);
        }

      },

      getNodeData: function(pathId, nodePath){
        var path = Musikata.db.paths[pathId];
        var node = path.getNodeByPath(nodePath);
        return node;
      },

      getViewClass: function(viewClassId) {
        if (viewClassId === 'foo') {
          var FooView = Marionette.ItemView.extend({
            template: function() {return 'foo'; }
          });
          return FooView;
        }
        else if (viewClassId === 'bar') {
          var BarView = Marionette.ItemView.extend({
            template: function() {return 'bar'; }
          });
          return BarView;
        }
        else if (viewClassId === 'path') {
          return PathView;
        }
      },

      // Will probably want to move this out later...
      showDeckNode: function(nodeModel, pathId, nodePath){
        // Save the parent path for the target destination.
        var destination = Backbone.history.fragment.replace(/(.*)\/.*/, '$1');

        // SUPER KLUDGY. BUT GET IT WORKING FIRST.
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

        // Create feelTheBeat app and return runner view.
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
        
        // Set body class.
        $('body').addClass('fit-screen');
        // Show the runner view.
        app.content.show(feelTheBeatApp.runnerView);
        window.foo = function(result){
          console.log('foo');
          feelTheBeatApp.runnerView.model.set('result', result || 'pass');
          feelTheBeatApp.runnerView.trigger('submit');

        }
      },

      updateUserPath: function(userPath){
        console.log('updateUserPath');
        var updateDeferred = new $.Deferred();
        // @TODO: Here we would submit the path to the persistence service.
        // For now, we fake a service call.
        var serviceDeferred = new $.Deferred();
        setTimeout(function() {
          // @TODO:
          // Eventually this would be a json object, from the 
          // persistence service. But for now, we fake it and just
          // pass backbone model.
          var updatedUserPath = userPath;
          serviceDeferred.resolve(updatedUserPath);
        }, 1000);

        // Handle the result from the service.
        // @TODO: normally this would be json object, but for now
        // we fake it and receive backbone model.
        serviceDeferred.done(function(updatedUserPath){
          var userPathId = [updatedUserPath.get('userId'), userPath.get('path').get('id')].join(':');
          Musikata.db.userPaths[userPathId] = updatedUserPath;
          // Resolve the update deferred to finish.
          updateDeferred.resolve(updatedUserPath);
        });

        return updateDeferred.promise();
      },

      mergePathAndUserPath: function(path, userPath){
        console.log('mergePathAndUserPath', path, userPath);
        userPath.get('path').visitNodes(function(nodePath, userPathNode){
          if (userPathNode.get('status') === 'completed'){
            var pathNode = path.getNodeByPath(nodePath);
            if (pathNode) {
              pathNode.set('status', 'completed');
            }
          }
        });
      }
    });



    var pathsRouter = new Marionette.AppRouter({
      appRoutes: {
        "path/:pathId/*nodePath": "showPathNode",
      },
      controller: new PathController()
    });
    
  });

  // Define service for generating views.

  // Add content region.
  app.addInitializer(function(options){
    console.log(options);
    app.addRegions({
      content: options.contentRegion
    });
  });

  // Start Backbone history to kick off routing.
  app.on("initialize:after", function(options){
    Backbone.history.start({
      root: window.location.pathname
    });
  });

  return app;

});
