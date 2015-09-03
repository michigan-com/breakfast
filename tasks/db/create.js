var exec = require('child_process').exec;
var path = require('path');

var gulp = require('gulp');
var runSequence = require('run-sequence');

var DB_PATH = path.resolve('src', 'server', 'db');
var createDbPath = path.resolve(DB_PATH, 'create_db.sh');
var createTablesPath = path.resolve(DB_PATH, 'create_tables.sql');

var connectDb = require('../../dist/db/db').connectDb;
var db;

function getDb() {
  if (!db) db = connectDb(process.env.DB_URI);
  return db
}

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
  var db = getDb();
  createTables(db, done);
});

/**
 * Add default users
 */
gulp.task('db-add-defaults', function() {
  var db = getDb();
  addDefaults(db);
});

/** Exported functions */

/**
 * Creates tables in database
 *
 * @param {Object} db - Object passed back from connectDB function call
 * @param {Function} done - Called when all tables have been created
 */
function createTables(db, done) {
  var models = db.models;

  // Used to asyncronously create the tables
  function createTableRecursion(remainingModels, done) {
    if (!remainingModels.length) {
      if (done) done();
      return;
    }

    remainingModels[0].sync({ force: true} ).then(function() {
      createTableRecursion(remainingModels.slice(1), done);
    });
  }

  createTableRecursion(models, done);
}

/**
 * Add default values to database
 *
 * @param {Object} db - Object passed back from connectDB function call
 */
function addDefaults(db) {

  var User = db.User;

  User.create({
    email: 'test@test.com',
    password: 'test'
  });
}

module.exports = {
  createTables: createTables,
  addDefaults: addDefaults
}
