require.config({
  paths: {
    text: 'bower_components/requirejs-text/text',
    jquery: 'bower_components/jquery/dist/jquery',
    backbone: 'bower_components/backbone/backbone',
    underscore: 'bower_components/underscore/underscore',
    marionette: 'bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
    'backbone.wreqr': 'bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
    'backbone.babysitter': 'bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
    handlebars: 'bower_components/handlebars/handlebars',
    'backbone.stickit': 'bower_components/backbone.stickit/backbone.stickit',
    'infect': 'bower_components/infect/infect'
  },

  packages: [
    {name: 'musikata.browser_client', location: 'src'},
    {name: 'musikata.path', location: 'bower_components/musikata.path/src'},
    {name: 'musikata.deck', location: 'bower_components/musikata.deck/src'},
    {name: 'musikata.audioManager', location: 'bower_components/musikata.audioManager/src'},
    {name: 'musikata.feelTheBeat', location: 'bower_components/musikata.feelTheBeat/src'}
  ],

  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
  },

  config: {
    text: {
      useXhr: function(){
        return true;
      }
    }
  }
});
