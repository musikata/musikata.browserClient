define(function(require){
  var Marionette = require('marionette');

  var PathItemView = require('./PathItemView');
  

  var PathListView = Marionette.CollectionView.extend({
    className: 'path-list',
    tagName: 'ul',
    itemView: PathItemView,
    itemViewOptions: {
      tagName: 'li'
    },
  });

  return PathListView;
});
