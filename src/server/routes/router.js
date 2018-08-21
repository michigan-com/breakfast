'use strict';

import { Router } from 'express';

import { createPassport } from './passport';
import logoFetch from './logoFetch';
import fontFetch from './fontFetch';
import login from './login';
import aws from './aws';
import sports from './sports';
import admin from './admin';
import { loginRequired } from '../middleware/login';

function registerRoutes(app) {
  const router = new Router();
  const passport = createPassport(app);

  // Create the different routes
  // TODO change this, no need to pass around the app for everything
  logoFetch.registerRoutes(app, router, passport);
  fontFetch.registerRoutes(app, router, passport);
  login.registerRoutes(app, router, passport);
  aws.registerRoutes(app, router, passport);
  sports.registerRoutes(app);
  admin.registerRoutes(app);

  // Basic routes
  router.get('/', (req, res) => {
    res.render('index', {
      messages: req.flash('error'),
    });
  });

  router.get('/gallery/', (req, res) => { res.render('gallery'); });

  router.get('/breakfast/',
    loginRequired,
    (req, res) => {
      res.render('breakfast');
    }
  );

  router.get('/elections/',
    loginRequired,
    (req, res) => {
      res.render('elections');
    }
  );

  app.use('/', router);
}

module.exports = {
  registerRoutes,
};
