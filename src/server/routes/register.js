import csrf from 'csurf';
import nodemailer from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import debug from 'debug';

import uuid from '../util/uuid';
import { Field } from '../util/form';
import { isValidEmail, getValidEmailDomains } from '../util/email';
import { formatInviteUrl } from '../util/parse';
import { hash } from '../util/hash';
import { csrfProtection } from '../middleware/csrf';

var logger = debug('breakfast:register');

/**
 * Register the 'register' urls
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  let db = app.get('db');
  let Invite = db.collection('Invite');
  let User = db.collection('User');

  let emailTransport = nodemailer.createTransport(sendmailTransport({}));

  // Render the login form
  router.get('/register/', csrfProtection(app), function(req, res) {
    // TODO abstract this into forms somehow
    let csrfToken;
    if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

    // Create the fields
    let csrf = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
    let username = new Field({ name: 'username', value: ''});

    let validDomains = getValidEmailDomains();

    res.render('register/register', {
      csrfToken,
      fields: [ csrf, username ],
      validDomains
    });
  });

  // Route for displaying the page after a registration email has been sent
  // TODO actually send email
  router.get('/register/email-sent/:email', function(req, res) {
    res.render('register/emailSent', {
      email: req.params.email // TODO maybe do this differently
    });
  });

  // Handle the initial register form submission
  router.post('/register/', function(req, res, next) {
    async function handleRegister(req, res) {
      let email = req.body.email.toLowerCase();

      if (!isValidEmail(email)) {
        res.status(422).send({
          error: {
            email: 'Invalid email'
          }
        });
        return;
      }

      // First, make sure this user doesn't already exist
      let user = await User.find({ email }).limit(1).next();

      if (!!user) {
        res.status(422).send({
          error: {
            username: 'This email is already in use.'
          }
        });
        return;
      }

      let invite = await Invite.find({ email }).limit(1).next();
      let token;
      if (!invite) {
        token = uuid()

        let inviteDoc = { email, token };
        invite = await Invite.insertOne(inviteDoc);

        logger(inviteDoc);
        let url = formatInviteUrl(inviteDoc);
        let mailOptions = {
          from: 'webmaster@breakfast.im',
          //to: [email],
          to: ['mvarano@michigan.com'],
          subject: 'Complete your Breakfast registration',
          text: `Thanks for registering with breakfast!\n\nVisit the link below to complete your registraion:\n\n\t${url}\n\nThanks!\nBreakfast Team`,
          html: `<p>Thanks for registering with breakfast!</p><p>Visit the link below to complete your registraion:</p><br><p><a href='${url}'>Registration Link</a></p><br><p>Thanks!</p><p>Breakfast Team</p>`,
        };

        if (process.env.NODE_ENV ==='production') {
          emailTransport.sendMessage(mailOptions);
        } else {
          logger(mailOptions);
        }
      } else {
        token = invite.token;
      }

      // for now, just forward to new url
      res.status(200).send({
        success: true,
        token
      });
    }

    return handleRegister(req, res).catch(function(err) {
      next(err)
    })
  });

  router.get('/register/:token/', csrfProtection(app), function(req, res, next) {
    async function registerEmail(req, res, next) {
      let token = req.params.token;
      let csrfToken;
      if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

      let invite = await Invite.find({ token }).limit(1).next();

      if (!invite) {
        res.status(404).end();
        return;
      }

      // Generate form fields
      let csrf = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
      let tokenField = new Field({ type: 'hidden', name: 'token', value: token });
      let email = new Field({ name: 'email', value: invite.email, readonly: true });
      let password = new Field({ type: 'password', name: 'password' });
      let confirmPassword = new Field({ type: 'password', name: 'confirmPassword', label: 'Confirm password' });

      res.render('register/createUser', {
        fields: [ csrf, tokenField, email, password, confirmPassword ]
      });
    }

    registerEmail(req, res, next).catch(function(err) {
      next(err);
    });
  });

  router.post('/create-user/', csrfProtection(app), function(req, res, next) {
    async function createUser(req, res, next) {
      logger(req.body);
      let email = req.body.email.toLowerCase();
      let token = req.body.token;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      // Parse the invite stuff first
      let invite = await Invite.find({ token }).limit(1).next();

      if (!invite) {
        // This email hasn't been invited yet. Forward them to the invite page
        req.flash('error', 'Please register your email before creating an account');
        res.redirect('/register/');
        return;
      }

      if (invite.token !== token) {
        res.status(422).send({
          errors: {
            token: ['Invalid token']
          }
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(422).send({
          errors: {
            password: ['Passwords don\'t match']
          }
        });
        return;
      }

      password = hash(password);

      let user = await User.insertOne({ email, password });

      // delete the invite
      await Invite.deleteOne({ _id: invite._id });

      // Force the login and send a success message
      passport.authenticate('local')(req, res, function() {
        res.redirect('/breakfast/');
      });
    }

    createUser(req, res, next).catch(function(err) {
      next(err);
    });
  });
}

module.exports = {
  registerRoutes
}
