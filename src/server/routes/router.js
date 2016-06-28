'use strict';

import { Router } from 'express';

import { createPassport } from './passport';
import logoFetch from './logoFetch';
import fontFetch from './fontFetch';
import login from './login';
import register from './register';
import aws from './aws';
import passwordReset from './password-reset';
import { loginRequired } from '../middleware/login';

function registerRoutes(app) {
  const router = new Router();
  const passport = createPassport(app);

  // Create the different routes
  // TODO change this, no need to pass around the app for everything
  logoFetch.registerRoutes(app, router, passport);
  fontFetch.registerRoutes(app, router, passport);
  login.registerRoutes(app, router, passport);
  register.registerRoutes(app, router, passport);
  aws.registerRoutes(app, router, passport);

  try {
    passwordReset.registerRoutes(app, router, passport);
  } catch (e) {
    throw new Error(e);
  }

  // Basic routes
  router.get('/', (req, res) => {
    res.render('index');
  });

  router.get('/gallery/', (req, res) => { res.render('gallery'); });

  router.get('/breakfast/',
    loginRequired,
    (req, res) => {
      res.render('breakfast');
    }
  );

  app.use('/', router);
}

module.exports = {
  registerRoutes,
};
