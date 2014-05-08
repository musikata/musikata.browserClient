define(function(require) {
  var _ = require('underscore');

  var PathView = require('musikata.path/PathView');

  
  var PathViewFactory = function(pathModel, viewOpts) {
    var classNames = ['musikata-path'];
    if (pathModel.get('pathType') === 'scroll'){
      classNames.push('scroll-path');
    }
    return new PathView(_.extend({
      className: classNames.join(' '),
      model: pathModel,
    }, viewOpts));
  };

  return PathViewFactory;
});
