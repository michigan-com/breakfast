'use strict';
import debug from 'debug';
import childProcess from 'child_process';

import { createApp } from './app';
import dbConnect from './util/dbConnect';

const logger = debug('breakfast:server');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

if (!process.env.DB_URI) {
  throw new Error('Process.env.DB_URI not set, please set it to a mongoDB instance');
}

// Connect to the db then start the app
async function startServer(gitHash = '') {
  const db = await dbConnect(process.env.DB_URI);


  // Create the app
  const app = createApp(db, true);
  const port = normalizePort(process.env.NODE_PORT || '3001');
  app.set('port', port);
  app.set('gitHash', gitHash);

  logger(`[SERVER] Environment: ${app.get('env')}`);
  const server = app.listen(port, '0.0.0.0', function appConnect(err) {
    if (err) throw new Error(err);

    const host = this.address();
    logger(`[SERVER] Started on ${host.address}:${host.port}`);
  });

  server.on('close', () => {
    logger('[SERVER] Closed nodejs application ...');
    db.close();
  });

  process.on('SIGTERM', () => {
    db.close();
    server.close();
  });
}

childProcess.exec('git rev-parse HEAD', function (err, stdout) {
  const gitHash = stdout.slice(0, 7);
  startServer(gitHash).catch((e) => {
    console.error(e);
    console.error(e.stack);
  });
});
