define(function(require){
  
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  var PathListView = require('./PathListView');
  
  var DojoHomeViewTemplate = require('text!./templates/DojoHomeView.html')

  var DojoHomeView = Marionette.Layout.extend({
    className: 'dojo-home',
    template: Handlebars.compile(DojoHomeViewTemplate),
    regions: {
      pathList: '.path-list-region'
    },
    onRender: function(){
      var pathListView = new PathListView({
        collection: this.model.get('paths') || new Backbone.Collection()
      });
      this.pathList.show(pathListView);
    }

  });

  return DojoHomeView;
});
