var gulp = require('gulp');
var gutil = require('gulp-util');

var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var neat = require('node-neat');

var cssSrc = './src/scss/';
var cssDist = './public/css/';
var cssFiles = cssSrc + '**/*.scss';

/**
 * Gulp task
 */
gulp.task('sass', function() {
  return bundleSass();
});

/**
 * Exported bundling function. Can be used by gulp-watch
 *
 * @memberof build/sass.js
 */
function bundleSass() {

  gutil.log('Compiling SASS files ...');

  var paths = ['./node_modules/'];
  paths = paths.concat(neat.includePaths);

  return gulp.src(cssFiles)
    .pipe(plumber(gutil.log))
    .pipe(sass({ includePaths: paths }))
    .pipe(gulp.dest(cssDist))
    .on('end', function() {
      gutil.log('Done compiling SASS files');
    });
}

function watchFunction() {
  gutil.log('Watching scss files ...');
  gulp.watch('./src/scss/**/*.scss', function() {
    return bundleSass();
  });
}

module.exports = {
  cssSrc: cssSrc,
  cssDist: cssDist,
  cssFiles: cssFiles,

  bundleSass: bundleSass,
  watchFunction: watchFunction
}
