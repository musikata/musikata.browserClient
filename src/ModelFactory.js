define(function(require){
  var _ = require('underscore');


  var ModelFactory = function(injector){
    this.injector = injector;
  };

  _.extend(ModelFactory.prototype, {
    createModel: function(attrs, options){
      var defaults = { parse: true };
      var ModelClass = this.injector.get(attrs.type + 'Model');
      return new ModelClass(attrs, _.extend(defaults, options));
    }
  });

  return ModelFactory;
});
