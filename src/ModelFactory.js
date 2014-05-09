define(function(require){
  var _ = require('underscore');
  var Backbone = require('backbone');


  var ModelFactory = function(injector){
    this.injector = injector;
  };

  _.extend(ModelFactory.prototype, {
    createModel: function(opts){
      var ModelClass;

      var defaults = { parse: true };
      if (opts.modelType) {
        ModelClass = this.injector.get(opts.modelType);
      } else {
        ModelClass = Backbone.Model;
      }
      return new ModelClass(opts.attrs, _.extend(defaults, opts.options));
    }
  });

  return ModelFactory;
});
