'use strict';

import passport from 'passport';
import { Strategy as SamlStrategy } from 'passport-saml';

function createPassport(app) {
  const samlConfig = {
    entryPoint: process.env.OKTA_LOGIN_LINK,
    cert: process.env.OKTA_CERT,
    path: '/auth/saml/callback/',
  };
  passport.use(new SamlStrategy(samlConfig,
    // this is the function that gets called when a user logs in via posting
    //  to the /login/ url
    (profile, done) => {
      done(null, profile);
    }
  ));

  passport.serializeUser((user, done) => {
    // TODO make this better somehow
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(async (user, done) => {
    done(null, JSON.parse(user));
  });

  return passport;
}

module.exports = {
  createPassport,
};
