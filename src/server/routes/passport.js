'use strict';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import { ObjectID } from 'mongodb';

import { passwordMatch } from '../util/hash';

function createPassport(app) {
  const db = app.get('db');
  const User = db.collection('User');

  async function loginCheck(emailInput, password, done) {
    const email = emailInput.toLowerCase();
    const user = await User.find({ email }).limit(1).next();

    if (!user || !passwordMatch(password, user.password)) {
      return done(null, false);
    }

    return done(null, user);
  }

  passport.use(new LocalStrategy({
    usernameField: 'email',
  },
    // this is the function that gets called when a user logs in via posting
    //  to the /login/ url
    (email, password, done) => {
      loginCheck(email, password, done).catch((err) => { throw new Error(err); });
    }
  ));

  passport.serializeUser((user, done) => {
    // TODO make this better somehow
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    async function deserialize() {
      const user = await User.find({ _id: ObjectID(_id) }).limit(1).next();

      return user;
    }

    try {
      const user = await deserialize(_id);
      done(null, user);
    } catch (e) {
      done(e, false);
    }
  });

  return passport;
}

module.exports = {
  createPassport,
};
