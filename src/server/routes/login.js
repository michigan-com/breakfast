import passport from 'passport';
import csrf from 'csurf';

let csrfProtection = csrf({ cookie: true});

function registerRoutes(router, passport) {

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
  router.post('/login/', passport.authenticate('local', {
    failureRedirect: '/login/',
    failureFlash: 'Login failure'
  }), function(req, res) {
    return res.redirect('/breakfast/');
  });
}

module.exports = {
  registerRoutes
}
