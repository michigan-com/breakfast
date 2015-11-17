'use strict';
import debug from 'debug';
import { MongoClient } from 'mongodb';

import { createApp } from './app';

var logger = debug('breakfast:server');

if (!process.env.DB_URI) {
  throw new Error('Process.env.DB_URI not set, please set it to a mongoDB instance');
}

// Connect to the db then start the app
MongoClient.connect(process.env.DB_URI, function(err, db) {
  // Create the app
  var app = createApp(db, true);
  var port = normalizePort(process.env.NODE_PORT || '3000');
  app.set('port', port);

  logger(`[SERVER] Environment: ${app.get('env')}`);
  var server = app.listen(port, '0.0.0.0', function(err) {
    if (err) throw new Error(err);

    let host = this.address();
    logger(`[SERVER] Started on ${host.address}:${host.port}`);
  });

  server.on('close', function() {
    logger("[SERVER] Closed nodejs application ...");
    disconnect();
  });

  process.on('SIGTERM', function () {
    server.close();
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
