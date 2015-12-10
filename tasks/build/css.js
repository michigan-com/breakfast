'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

// Postcss + plugins
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var nested = require('postcss-nested');
var vars = require('postcss-simple-vars');
var cssImport = require('postcss-import');
var calc = require('postcss-calc');
var extend = require('postcss-extend');
var mixins = require('postcss-mixins');
var color = require('postcss-color-function');

var processors = [
  cssImport,
  autoprefixer({ browsers: ['last 2 versions']}),
  mixins,
  nested,
  vars,
  calc,
  extend,
  color()
];

function bundleOpts() {
  return {
    prod: false,
    src: './src/css/**/*.css',
    dest: './public/css'
  };
}

gulp.task('css', function() {
  return bundle(bundleOpts());
})


function bundle(opts) {
 return gulp.src(opts.src)
    .pipe(postcss(processors, {
      maps: { inline: true }
    }))
    .pipe(gulp.dest(opts.dest))
    .on('end', function() {
      gutil.log('PostCSS finished compiling CSS files');
    });
}

function bundleProd(opts) {
  return gulp.src(opts.src)
    .pipe(postcss(processors))
    .pipe(gulp.dest(opts.dest))
    .on('end', function() {
      gutil.log('Sass finished compiling CSS files');
    });
}

function watchFunction() {
  gulp.watch(bundleOpts().src, ['css']);
}

module.exports = {
  opts: bundleOpts,
  watchFunction: watchFunction
};
