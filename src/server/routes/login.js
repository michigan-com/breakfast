'use strict';

import { csrfProtection } from '../middleware/csrf';
import { Field } from '../util/form';

/**
 * Register the login urls
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  /** Login Routes */

  // Render the login page
  router.get('/login/', csrfProtection(app), (req, res) => {
    // If the user is already logged in, redirect to breakfast
    res.redirect(res.locals.oktaLogin);
  });

  router.get('/login/failed/', (req, res) => {
    res.json({ error: 'failed to login' });
  });

  router.get('/login/callback/', (req, res) => {
    res.redirect('/breakfast/');
  });

  // Handle the login response
  router.post('/auth/saml/callback/', passport.authenticate('saml', {
    failureRedirect: '/login/failed/',
    failureFlash: 'Username/password combination does not match, please try again',
  }),
    (req, res) => {
      res.redirect('/breakfast/');
    }
  );

  router.get('/logout/', (req, res) => {
    req.logout();

    res.redirect('/');
  });
}

module.exports = {
  registerRoutes,
};
