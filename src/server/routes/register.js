'use strict';

import nodemailer from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
import debug from 'debug';

import uuid from '../util/uuid';
import { Field } from '../util/form';
import { isValidEmail, getValidEmailDomains } from '../util/email';
import { formatInviteUrl } from '../util/parse';
import { hash } from '../util/hash';
import { csrfProtection } from '../middleware/csrf';

const logger = debug('breakfast:register');

/**
 * Register the 'register' urls
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  const db = app.get('db');
  const Invite = db.collection('Invite');
  const User = db.collection('User');

  const emailTransport = nodemailer.createTransport(sesTransport({
    accessKeyId: process.env.SES_USERNAME,
    secretAccessKey: process.env.SES_PASSWORD,
  }));

  // Render the login form
  router.get('/register/', csrfProtection(app), (req, res) => {
    // TODO abstract this into forms somehow
    let csrfToken;
    if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

    // Create the fields
    const csrfField = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
    const username = new Field({ name: 'username', value: '' });

    const validDomains = getValidEmailDomains();

    res.render('register/register', {
      csrfToken,
      fields: [csrfField, username],
      validDomains,
    });
  });

  // Route for displaying the page after a registration email has been sent
  // TODO actually send email
  router.get('/register/email-sent/:email', (req, res) => {
    res.render('register/emailSent', {
      email: req.params.email, // TODO maybe do this differently
    });
  });

  // Handle the initial register form submission
  router.post('/register/', (req, res, next) => {
    async function handleRegister() {
      const email = req.body.email.toLowerCase();

      if (!isValidEmail(email)) {
        res.status(422).send({
          error: 'Invalid email',
        });
        return;
      }

      // First, make sure this user doesn't already exist
      const user = await User.find({ email }).limit(1).next();

      if (!!user) {
        res.status(422).send({
          error: 'This email is already in use.',
        });
        return;
      }

      let invite = await Invite.find({ email }).limit(1).next();
      let token;
      if (!invite) {
        token = uuid();
        invite = await Invite.insertOne({ email, token });
      } else {
        token = invite.token;
      }

      const url = formatInviteUrl(token);
      const mailOptions = {
        from: 'help@breakfast.im',
        to: [email],
        subject: 'Complete your Breakfast registration',
        text: `Thanks for registering with breakfast!\n\nVisit the link below to complete your registraion:\n\n\t${url}\n\nThanks!\nBreakfast Team`,
        html: `<p>Thanks for registering with breakfast!</p><p>Visit the link below to complete your registraion:</p><br><p><a href='${url}'>Registration Link</a></p><br><p>Thanks!</p><p>Breakfast Team</p>`,
      };

      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
        await emailTransport.sendMail(mailOptions);
      } else {
        logger(mailOptions);
      }

      res.status(200).send({
        success: true,
      });
    }

    return handleRegister().catch((err) => { next(err); });
  });

  router.get('/register/:token/', csrfProtection(app), (req, res, next) => {
    async function registerEmail() {
      const token = req.params.token;
      let csrfToken;
      if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

      const invite = await Invite.find({ token }).limit(1).next();

      if (!invite) {
        res.status(404).end();
        return;
      }

      // Generate form fields
      const csrf = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
      const tokenField = new Field({ type: 'hidden', name: 'token', value: token });
      const email = new Field({ name: 'email', value: invite.email, readonly: true });
      const password = new Field({ type: 'password', name: 'password' });
      const confirmPassword = new Field({ type: 'password', name: 'confirmPassword',
            label: 'Confirm password' });

      res.render('register/createUser', {
        fields: [csrf, tokenField, email, password, confirmPassword],
      });
    }

    registerEmail(req, res, next).catch((err) => { next(err); });
  });

  router.post('/create-user/', csrfProtection(app), (req, res, next) => {
    async function createUser() {
      let password = req.body.password;
      const email = req.body.email.toLowerCase();
      const token = req.body.token;
      const confirmPassword = req.body.confirmPassword;

      // Parse the invite stuff first
      const invite = await Invite.find({ token }).limit(1).next();

      if (!invite) {
        // This email hasn't been invited yet. Forward them to the invite page
        req.flash('error', 'Please register your email before creating an account');
        res.redirect('/register/');
        return;
      }

      if (invite.token !== token) {
        res.status(422).send({
          errors: {
            token: ['Invalid token'],
          },
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(422).send({
          errors: {
            password: ['Passwords don\'t match'],
          },
        });
        return;
      }

      password = hash(password);

      await User.insertOne({ email, password });

      // delete the invite
      await Invite.deleteOne({ _id: invite._id });

      // Force the login and send a success message
      passport.authenticate('local')(req, res, () => {
        res.redirect('/breakfast/');
      });
    }

    createUser(req, res, next).catch((err) => { next(err); });
  });
}

module.exports = { registerRoutes };
