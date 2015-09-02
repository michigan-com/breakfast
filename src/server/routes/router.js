import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import logoFetch from './logoFetch';
import login from './login';
import { User } from '../db/db';
import { loginRequired } from '../middleware/login';

let router = new Router();
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  // this is the function that gets called when a user logs in via posting
  //  to the /login/ url
  async function(email, password, done) {
    let user = await User.find({
      where: {
        email: {
          $eq: email
        }
      }
    });

    if (!user || !user.passwordMatch(password)) {
      return done(null, false);
    }

    return done(null, user);
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
  loginRequired,
  function(req, res) {
    res.render('breakfast');
  }
);


module.exports = router
