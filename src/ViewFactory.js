define(function(require){
  var _ = require('underscore');


  var ViewFactory = function(injector){
    this.injector = injector;
  };

  _.extend(ViewFactory.prototype, {
    createView: function(opts){
      var defaults = { viewFactory: this };
      var ViewClass = this.injector.get(opts.model.get('viewType'));
      return new ViewClass(_.extend(defaults, opts));
    }
  });

  return ViewFactory;
});
