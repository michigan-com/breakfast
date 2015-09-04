import csrf from 'csurf';

import { csrfProtection } from '../util/csrf';

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
    if (req.user) {
      res.redirect('/breakfast/');
      return;
    }

    let csrfToken;
    if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

    res.render('login', {
      csrfToken,
      messages: req.flash('error')
    });
  });

  // Handle the login response
  router.post('/login/', passport.authenticate('local', {
      failureRedirect: '/login/',
      failureFlash: 'Login failure'
    }),
    function(req, res) {
      return res.redirect('/breakfast/');
    }
  );

  router.get('/logout', function(req, res) {
    req.logout();

    res.redirect('/');
  });
}

module.exports = {
  registerRoutes
}
