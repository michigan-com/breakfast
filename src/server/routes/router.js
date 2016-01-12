import { Router } from 'express';

import { createPassport } from './passport';
import logoFetch from './logoFetch';
import fontFetch from './fontFetch';
import login from './login';
import register from './register';
import aws from './aws';
import { loginRequired } from '../middleware/login';

function registerRoutes(app) {
  let router = new Router();
  let passport = createPassport(app);

  // Create the different routes
  // TODO change this, no need to pass around the app for everything
  logoFetch.registerRoutes(app, router, passport);
  fontFetch.registerRoutes(app, router, passport);
  login.registerRoutes(app, router, passport);
  register.registerRoutes(app, router, passport);
  aws.registerRoutes(app, router, passport);

  // Basic routes
  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/gallery/', (req, res) => { res.render('gallery'); });

  router.get('/breakfast/',
    loginRequired,
    function(req, res) {
      res.render('breakfast');
    }
  );

  app.use('/', router);
}


module.exports = {
  registerRoutes
}
