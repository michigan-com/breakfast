'use strict';

import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';

import storeLocals from './middleware/storeLocals';
import router from './routes/router';
import './env';
import dir from './util/dir';

/**
 * Create an express app and return it. This way, we can spin up apps with
 * different DB connections, making it easeier to test.
 *
 * @param {String} dbString - Connection string for DB
 */
function createApp(db, enableCsrf=true) {
  var app = express();
  var BASE_DIR = path.dirname(__dirname);

  app.set('views', dir('views'));
  app.set('view engine', 'jade');
  app.set('use csrf', enableCsrf);

  //app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(BASE_DIR, 'public')));
  app.use(session({
    secret: 'Whats for breakfast eh?',
    resave: false,
    saveUninitialized: false
  }));
  if (enableCsrf) {
    //app.use(csrf({ cookie: true }));
  }
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(storeLocals());

  // Set the DB before registering the routes
  app.set('db', db);

  // Register the routes
  router.registerRoutes(app);

  return app;
}

module.exports = {
  createApp
}
