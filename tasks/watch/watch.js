var gulp = require('gulp');
var gutil = require('gulp-util');

var plumber = require('gulp-plumber');
var tap = require('gulp-tap');

var publicJs = require('../build/public-js.js');
var serverJs = require('../build/server-js.js');
var css = require('../build/css.js');

// This gulp task now restarts after each JS error yaaaaay
gulp.task('watch', function() {

  // Watch the public JS bundles and browserify them
  publicJs.watchFunction();

  // Watch the server JS and babelify them
  serverJs.watchFunction();

  // Watch the css files and compile them into css
  css.watchFunction();

});
