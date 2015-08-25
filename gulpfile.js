'use strict';

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var tap = require('gulp-tap');
var sourcemaps = require('gulp-sourcemaps');
var neat = require('node-neat');
var crashSound;
try {
  crashSound = require('gulp-crash-sound');
} catch (e) {}

var babelify = require("babelify");
var reactify = require('reactify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var pkgify = require('pkgify');
var source = require('vinyl-source-stream');
var each = require('lodash/collection/forEach');
var browserifyShim = require('browserify-shim');

var config = require('./config');

var jsSrc = './public/js/src/';
var jsDist = './public/js/dist/';
var jsBundle = ['breakfast.js'];

gulp.task('sass', function() {
  return bundleSass();
});

gulp.task('browserify', function(cb) {
  var bcb = (function() {
    var counter = 0;
    return function() {
      counter++;
      if (counter == jsBundle.length) return cb();
    };
  })();
  each(jsBundle, function(fname) {
    var filePath = jsSrc + fname;
    gulp.src(filePath)
        .pipe(plumber(gutil.log))
        .pipe(tap(bundleJs))
        .pipe(gulp.dest(jsDist))
        .on('end', function() {
          gutil.log('Browserify finished creating: ' + filePath);
          // if (typeof bcb === 'function') bcb();
        });
  });
});

// This gulp task now restarts after each JS error yaaaaay
gulp.task('watch', function() {
  // https://gist.github.com/RnbWd/2456ef5ce71a106addee
  each(jsBundle, function(fname) {
    gutil.log('Watching ' + fname + ' ...');
    var filePath = jsSrc + fname;
    gulp.watch(filePath, function() {
      return gulp.src(filePath)
        .pipe(plumber(gutil.log))
        .pipe(tap(bundleJs))
        .pipe(gulp.dest(jsDist))
        .on('end', function() {
          gutil.log('Browserify finished creating: ' + filePath);
          // if (typeof bcb === 'function') bcb();
        });
    });
  });

  gutil.log('Watching node modules ...');
  gulp.watch('./src/**/*.js', ['babel']);

  gutil.log('Watching scss files ...');
  gulp.watch('./public/scss/**/*.scss', function() {
    return bundleSass();
  });
});

gulp.task('babel', function() {
  babelBundle();
});

gulp.task('default', ['sass', 'babel', 'browserify']);

gulp.task('users', function(cb) {
  var db = require('./dist/db');
  db.connect();
  db.User.find().exec(function(err, results) {
    if (err) throw new Error(err);
    gutil.log(JSON.stringify(results, null, 2));
    db.disconnect();
    cb();
  });
});

gulp.task('resetDb', function(cb) {
  var db = require('./dist/db');
  db.connect();
  gutil.log('Removing User documents ...');
  db.User.remove().exec(function(err) {
    if (err) throw new Error(err);
    gutil.log('Removing Article documents ...');
    db.Article.remove().exec(function(err) {
      if (err) throw new Error(err);
      gutil.log('Removing Toppages documents');
      db.Toppages.remove().exec(function(err) {
        if (err) throw new Error(err);
        db.disconnect();
        cb();
      });
    });
  });
});

// https://gist.github.com/RnbWd/2456ef5ce71a106addee
function bundleJs(file, bcb) {

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
    .transform(reactify)
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

function babelBundle() {
  var src = './src/**/*.js';
  var dist = './dist';

  gutil.log('Babel is generating ' + src + ' files to ' + dist + ' ...');

  return gulp.src(src)
    .pipe(plumber(gutil.log))
    .pipe(babel({ stage: 0, optional: ['runtime'] }))
    .pipe(gulp.dest(dist))
    .on('end', function() {
      gutil.log('Done babelifying');
    });
}

function bundleSass() {
  var cssSrc = './public/scss/';
  var cssDist = './public/css/';
  var cssFiles = cssSrc + '**/*.scss';

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

/**
 * Generate some basic stats on the logos we currently have in the system,
 * so we don't have to read the image width/height every time someone
 * changes a logo.
 *
 * Find ./public/img/logo/*.svg, parses the file contents for the width and the
 * height, and saves the information in ./public/js/lib/logos.json
 */
gulp.task('generateLogoJson', function() {
  var logo_root = path.join(__dirname, 'public', 'img', 'logos');
  var outfile = path.join(__dirname, 'public', 'js', 'src', 'lib', 'logoInfo.json');
  var ratioRegex = /width="(\d+(?:\.\d+)?)px"\s+height="(\d+(?:\.\d+)?)px"/;
  var logoNames = {
    'dfp.svg': 'Detroit Free Press',
    'dn.svg': 'Detroit News'
  };

  var files = fs.readdirSync(logo_root);
  var logoJson = {};
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!/\.svg$/.exec(file)) continue;

    if (!(file in logoNames)) {
      throw new Error('Need to specify name for ' + file + ' in the logoNames object in the generateLogoJson gulp task');
    }

    var contents = fs.readFileSync(path.join(logo_root, file));

    var match = ratioRegex.exec(contents);
    if (!match) {
      throw new Error('Can\'t find height/width for ' + file);
    }

    logoJson[file] = {
      width: match[1],
      height: match[2],
      aspectRatio: match[1] / match[2],
      name: logoNames[file]
    }
  }
  fs.writeFile(outfile, JSON.stringify(logoJson), function(err) {
    if (err) throw new Error(err);

    console.log('Saved ' + outfile);
  })
  console.log(logoJson);
});
