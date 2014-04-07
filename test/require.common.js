require.config({
  paths: {
    text: 'bower_components/requirejs-text/text',
    jquery: 'bower_components/jquery/jquery',
    backbone: 'bower_components/backbone/backbone',
    underscore: 'bower_components/underscore/underscore',
    marionette: 'bower_components/backbone.marionette/lib/backbone.marionette',
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

    'marionette': {
      deps: ['backbone'],
      exports: 'Backbone.Marionette'
    },

    'handlebars': {
      exports: 'Handlebars'
    },

  }
});
