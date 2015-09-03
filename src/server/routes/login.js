import csrf from 'csurf';

let csrfProtection = csrf({ cookie: true});

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
  router.get('/login/', csrfProtection, (req, res) => {

    // If the user is already logged in, redirect to breakfast
    if (req.user) {
      res.redirect('/breakfast/');
      return;
    }

    res.render('login', {
      csrfToken: req.csrfToken(),
      messages: req.flash('error')
    });
  });

  // Handle the login response
  router.post('/login/',
  function(req, res, next) {
    console.log(req.body);
    next();
  }, passport.authenticate('local', {
    failureRedirect: '/login/',
    failureFlash: 'Login failure'
  }), function(req, res) {
    return res.redirect('/breakfast/');
  });
}

module.exports = {
  registerRoutes
}
