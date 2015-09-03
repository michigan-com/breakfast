import passport from 'passport';
import LocalStrategy from 'passport-local';

function createPassport(app) {
  let User = app.get('db').User;

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
    let user = await User.find({
      where: {
        email
      }
    });

    if (!user || !user.passwordMatch(password)) {
      return done(null, false);
    }

    return done(null, user);
  }

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

  return passport;
}

module.exports = {
  createPassport
}
