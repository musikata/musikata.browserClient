define(function(require){
  
  var Marionette = require('marionette');
  var Handlebars = require('handlebars');
  
  var DojoHomeViewTemplate = require('text!./templates/DojoHomeView.html')

  var DojoHomeView = Marionette.ItemView.extend({
    className: 'dojo-home',
    template: Handlebars.compile(DojoHomeViewTemplate),
  });

  return DojoHomeView;
});
