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
  },

  packages: [
    {name: 'musikata_browser_client', location: 'src'}
  ],

  shim: {
    'underscore': {
      deps: [],
      exports: '_'
    },

    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'handlebars': {
      exports: 'Handlebars'
    },

  }
});
