'use strict';

import MongoClient from 'mongodb';

function dbConnect(dbString) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbString, (err, client) => {
      if (err) reject(err);
      else resolve(client.db('breakfast'));
    });
  });
}

module.exports = dbConnect;
