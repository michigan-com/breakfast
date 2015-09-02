import passport from 'passport';
import LocalStrategy from 'passport-local';
import csrf from 'csurf';

import { User } from '../db/db';

let csrfProtection = csrf({ cookie: true});
passport.use(new LocalStrategy({
    usernameField: 'email'
},
  function(email, password, done) {
    User.find({ email }).then(function(user) {
      if (!user) {
        console.log(`User ${email} not found`);
        return done(null, false);
      }

      // TODO validate password
      console.log(`User ${email} found}`);

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  // TODO make this better somehow
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    // user will be null if the id isn't found, might want to
    // revisit this
    done(null, user);
  });
});

function registerRoutes(router) {

  /** Login Routes */

  // Render the login page
  router.get('/login/', csrfProtection, (req, res) => {
    res.render('login', {
      csrfToken: req.csrfToken()
    });
  });

  // Handle the login response
  router.post('/login/', passport.authenticate('local', {
    successRedirect: '/breakfast/',
    failureRedirect: '/login/',
    failureFlash: true
  }));
}

module.exports = {
  registerRoutes
}
