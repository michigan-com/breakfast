import passport from 'passport';
import LocalStrategy from 'passport-local';
import debug from 'debug';
import { ObjectID } from 'mongodb';

import { passwordMatch } from '../util/hash';

var logger = debug('breakfast:routes:passport');

function createPassport(app) {
  let db = app.get('db');
  let User = db.collection('User');

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    // this is the function that gets called when a user logs in via posting
    //  to the /login/ url
    function(email, password, done) {
      loginCheck(email, password, done).catch(function(err) { throw new Error(err) });
    }
  ));

  async function loginCheck(email, password, done) {
    let user = await User.find({ email }).limit(1).next();

    if (!user || !passwordMatch(password, user.password)) {
      return done(null, false);
    }

    return done(null, user);
  }

  passport.serializeUser(function(user, done) {
    // TODO make this better somehow
    return done(null, user._id);
  });

  passport.deserializeUser(function(_id, done) {
    async function deserialize(_id) {
      let user = await User.find({ _id: ObjectID(_id) }).limit(1).next();

      return user;
    }

    try {
      let user = deserialize(_id);
      done(null, user);
    } catch(e) {
      done(e, false);
    }
  });

  return passport;
}

module.exports = {
  createPassport
}
