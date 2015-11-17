var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var tap = require('gulp-tap');
var sourcemaps = require('gulp-sourcemaps');

var babelify = require("babelify");
// var reactify = require('reactify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var pkgify = require('pkgify');
var source = require('vinyl-source-stream');
var each = require('lodash/collection/forEach');
var browserifyShim = require('browserify-shim');

var jsSrc = './src/client/';
var jsDist = './public/js/';
var jsBundle = ['breakfast/breakfast.js', 'register.js'];
var jsFiles = jsSrc + '**/*.js';

/**
 * Gulp task
 * Bundle all the JS files specified in the jsBundle array
 */
gulp.task('browserify', function() {
  each(jsBundle, function(fname) {
    var filePath = jsSrc + fname;
    gulp.src(filePath)
        .pipe(plumber(gutil.log))
        .pipe(tap(bundleJs))
        .pipe(gulp.dest(jsDist))
        .on('end', function() {
          gutil.log('Browserify finished creating: ' + filePath);
        });
  });
});

/**
 * Exported bundling functions. Given a file, will run it through the
 * browserify task
 * From:  https://gist.github.com/RnbWd/2456ef5ce71a106addee
 *
 * @memberof build/public-js.js
 */
function bundleJs(file) {

  if (!fs.existsSync(file.path)) {
    gutil.log('Could not find ' + file.path + ', ignoring')
    return;
  }

  gutil.log('Browserify is compiling ' + file.path);
  var b = browserify(file.path, { debug: true })
    .transform(babelify.configure({ stage: 0, optional: ['runtime'] }))
/*    .transform(pkgify, {*/
      //packages: {
        //publicLib: './public/js/src/lib',
        //jsx: './public/js/src/jsx',
        //charts: './public/js/src/charts',
        //framework: './public/js/src/framework'
      //},
      //relative: __dirname
    /*})*/
    .transform(browserifyShim, { global: true });

  // Do the necessary thing for tap/plumber
  var stream = b.bundle();
  file.contents = stream;

  // Source map
  stream
    .pipe(source(file.path))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .on('error', gutil.log)
    //  .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsDist));
}

/**
 * Called in the gulp.task('watch'). Watches the bundle-ed files and compiles
 * them on save
 */
function watchFunction() {

  gutil.log('Watching ' + jsFiles);
  gulp.watch(jsFiles, function() {
    each(jsBundle, function(fname) {
      var filePath = jsSrc + fname;
      gulp.src(filePath)
        .pipe(plumber(gutil.log))
        .pipe(tap(bundleJs))
        .pipe(gulp.dest(jsDist))
        .on('end', function() {
          gutil.log('Browserify finished creating: ' + filePath);
        });
    });
  });
}

module.exports = {
  jsSrc: jsSrc,
  jsDist: jsDist,
  jsBundle: jsBundle,

  bundleJs: bundleJs,
  watchFunction: watchFunction
}
