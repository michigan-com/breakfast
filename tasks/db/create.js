var exec = require('child_process').exec;
var path = require('path');

var gulp = require('gulp');
var runSequence = require('run-sequence');

var DB_PATH = path.resolve('src', 'server', 'db');
var createDbPath = path.resolve(DB_PATH, 'create_db.sh');
var createTablesPath = path.resolve(DB_PATH, 'create_tables.sql');

gulp.task('db-init', function() {
  runSequence('db-create', 'db-table-create', 'db-add-defaults');
});

/**
 * Create the database (that was easier than expected)
 *
 * @memberof db/create.js
 */
gulp.task('db-create', function(done) {

  exec(createDbPath, function(err, stdout, stderr) {
    if (err) {
      if (/database\s+\"\S+\"\s+already\s+exists/.exec(err)) {
        console.log('Database already exists, creating tables now');
      } else {
        throw new Error(err);
      }
    }

    done();
  });
});

/**
 * Create database tables from the models defined in DB
 */
gulp.task('db-table-create', function(done) {
  var db = require('../../dist/db/db');

  var models = db.models;

  for (var i = 0; i < models.length; i++) {
    var model= models[i];

    model.sync({ force: true} );
  }
});

/**
 * Add default users
 */
gulp.task('db-add-defaults', function() {
  var db = require('../../dist/db/db');

  var User = db.User;

  User.create({
    email: 'test@test.com',
    password: 'test'
  });
});
