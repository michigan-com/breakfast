var connectDb = require('../../dist/db').connectDb;

/**
 * Drop tables in database. Don't want to make a gulp task out of this, but it
 * is a task nonetheless
 *
 * @param {Object} db - Object passed back from connectDB function call
 */
function dropTables(db, done) {
  var models = db.models;

  function dropTableRecusion(remainingModels, done) {
    if (!remainingModels.length) {
      if (done) done();
      return;
    }

    remainingModels[0].drop().then(function() {
      dropTableRecusion(remainingModels.slice(1), done);
    })

  }

  dropTableRecusion(models, done);
}

module.exports = {
  dropTables: dropTables
}
