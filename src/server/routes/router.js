import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import logoFetch from './logoFetch';
import login from './login';

import { User } from '../db/db';

let router = new Router();
passport.use(new LocalStrategy({
    usernameField: 'email'
},
  function(email, password, done) {
    console.log(`Looking up ${email}`);
    User.find({ email }).then(function(user) {
      if (!user || !user.passwordMatch(password)) {
        console.log(`Login failed`);
        return done(null, false);
      }

      console.log(`Login success`);

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

// Create the different routes
logoFetch.registerRoutes(router, passport);
login.registerRoutes(router, passport);

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/breakfast/',
  function(req, res) {
    if (!req.user) {
      req.flash('error', 'You need to login');
      res.redirect('/login/');
      return;
    }
    console.log('BREAKFAST TIME');
    console.log(req.user);
    res.render('breakfast');
  }
);


module.exports = router
