import csrf from 'csurf';

import uuid from '../util/uuid';

let csrfProtection = csrf({ cookie: true});

/**
 * Register the 'register' urls
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  let db = app.get('db');
  let Invite = db.Invite;
  let User = db.User;

  // Render the login form
  router.get('/register/', csrfProtection, function(req, res) {
    res.render('register/register', {
      csrfToken: req.csrfToken()
    });
  });

  // Route for displaying the page after a registration email has been sent
  router.get('/register/email-sent/:email', function(req, res) {
    res.render('register/emailSent', {
      email: req.params.email // TODO maybe do this differently
    });
  })

  // Handle the initial register form submission
  router.post('/register/', function(req, res, next) {
    async function handleRegister(req, res) {
      let email = req.body.email;

      // First, make sure this user doesn't already exist
      let user = await User.findOne({
        where: {
          email
        }
      });
      if (user) {
        res.render('register/error', {
          error: `User ${email} already exists`
        });
        return;
      }

      let invite = await Invite.findOne({
        where: {
          email
        }
      });

      if (!invite) {
        let token = uuid()
        invite = await Invite.create({
          email,
          token
        });
      }

      res.redirect(`/register/email-sent/${email}`);
    }

    return handleRegister(req, res).catch(function(err) {
      next(err)
    })
  });

  router.get('/register/:token/', csrfProtection, async function(req, res) {
    let token = req.params.token;

    let invite = await Invite.find({
      where: {
        token
      }
    });

    if (!invite) {
      res.status(404).end();
    }

    res.render('register/createUser', {
      email: invite.email,
      csrfToken: req.csrfToken()
    });
  });

  router.post('/create-user/', function(req, res) {
    console.log(req.body);
  });
}

module.exports = {
  registerRoutes
}
