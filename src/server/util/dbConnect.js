'use strict';

import MongoClient from 'mongodb';

function dbConnect(dbString) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbString, (err, db) => {
      if (err) reject(err);
      resolve(db);
    });
  });
}

module.exports = dbConnect;
