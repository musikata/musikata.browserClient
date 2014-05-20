/*
 * Unit test configuration.
 */

module.exports = function(config) {

  var srcFiles = [
    { pattern: 'src/**/*.js', watched: true, included: false},
    { pattern: 'src/**/*.html', watched: true, included: false}
  ];

  var libFiles = [
    { pattern: 'bower_components/**/*.js', watched: false, included: false}
  ];

  var configFiles = [
    'test/require.common.js',
    'test/test-main.js'
  ];


  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],

    /*
    plugins : [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-requirejs',
      'karma-growl-reporter'
    ],
    */

    // list of files / patterns to load in the browser
    files: []
      .concat(srcFiles)
      .concat(libFiles)
      .concat(configFiles)
      ,

    // list of files to exclude
    exclude: [
      // Don't include specs for 3rd party libs.
      'bower_components/**/*spec.js'
    ],

    // Set preprocessers to be empty, so that .html files
    // will be served as html for require.js text plugin.
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'growl'],

    growlReporter: {
      reportEachFailure: true
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
