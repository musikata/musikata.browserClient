define(function(require){
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');

  var PathItemViewTemplate = require('text!./templates/PathItemView.html');


  var PathItemView = Marionette.ItemView.extend({
    className: 'path-item',
    template: Handlebars.compile(PathItemViewTemplate),
    templateHelpers: function(){
      return {
        title: this.model.get('title') || 'untitled',
        url: Backbone.history.root + '#/path/' + this.model.id + '/'
      }
    }
  });

  return PathItemView;
});
