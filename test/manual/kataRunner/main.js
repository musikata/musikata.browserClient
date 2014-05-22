define(function(require) {
  var Backbone = require('backbone');
  var NestedTypes = require('backbone.nestedTypes');

  var KataRunnerPresenter = require('src/kataRunner/KataRunnerPresenter');
  var KataRunnerView = require('src/kataRunner/KataRunnerView');

  var viewModel = new KataRunnerPresenter({
    level: 3,
    milestones: 2,
    maxScore: 20
  });

  var view = new KataRunnerView({el: '#content', model: viewModel});
  window.v = view;

  view.render();
  viewModel.start();

});
