import MongoClient from 'mongodb';

function dbConnect(dbString) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(dbString, function(err, db) {
      if (err) reject(err);
      resolve(db);
    })
  });
}

module.exports = dbConnect;