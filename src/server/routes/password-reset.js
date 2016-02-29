'use strict';

import debug from 'debug';
import nodemailer from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';

import { Field } from '../util/form';
import { csrfProtection } from '../middleware/csrf';
import { formatPasswordResetUrl } from '../util/parse';
import { isValidEmail } from '../util/email';
import { hash } from '../util/hash';
import uuid from '../util/uuid';

var logger = debug('breakfast:password');

/**
 * Register the 'password' urls
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  let db = app.get('db');
  let PasswordReset = db.collection('PasswordReset');
  let User = db.collection('User');

  // TODO abstract
  let emailTransport = nodemailer.createTransport(sendmailTransport({}));

  router.get('/password-reset/', csrfProtection(app), (req, res) => {
    let csrfToken;
    if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

    let csrf = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
    let email =new Field({ name: 'email', value: '' });

    res.render('password-reset/request-reset', {
      csrfToken,
      fields: [ csrf, email ]
    })
  });

  router.post('/password-reset/', (req, res, next) => {
    async function handleReset(req, res){
      let email = req.body.email.toLowerCase();

      if (!isValidEmail(email)) {
        return res.status(422).send({
          error: {
            email: 'Invalid email'
          }
        });
      }

      // First, make sure this user exists
      let user = await User.find({ email }).limit(1).next();

      if (!user) {
        return res.status(422).send({
          error: {
            user: 'This email is not found in our system'
          }
        });
      }

      let resetObj = await PasswordReset.find({ email }).limit(1).next();
      let token;
      if (!resetObj) {
        token = uuid();
        resetObj = await PasswordReset.insertOne({ email, token });
      } else {
        token = resetObj.token;
      }

      let url = formatPasswordResetUrl(token);
      let mailOptions = {
        from: 'webmaster@breakfast.im',
        to: [email],
        subject: 'Password Reset for Breakfast',
        text: `Greetings!\n\nThis email was generated because someone requested a password reset for this email account in Breakfast.\n\nClick the following link to reset your password.\n\n\t${url}\n\n(If you did not request this reset, please ignore this email.)\n\nThanks!\nBreakfast Team`,
        email: `<p>Greetings!</p><p>This email was generated because someone requested a password reset for this email account in Breakfast.</p><p>Click the following link to reset your password.</p><br><p><a href='${url}'>Reset Link</a></p><br><p style='italics'>(If you did not request this reset, please ignore this email.)</p><br><p>Thanks!<br>Breakfast Team</p>`,
      }

      if (process.env.NODE_ENV ==='production') {
        emailTransport.sendMail(mailOptions);
      } else {
        logger(mailOptions);
      }

      res.status(200).send({
        success: true,
      });
    }

    return handleReset(req, res).catch((err) => {
      next(err);
    });
  });

  router.get('/password-reset/:token/', csrfProtection(app), (req, res, next) => {
    async function renderPasswordReset(req, res, next) {
      let token = req.params.token;
      let csrfToken;
      if (typeof req.csrfToken === 'function') csrfToken = req.csrfToken();

      let resetObj = await PasswordReset.find({ token }).limit(1).next();

      if (!resetObj) {
        return res.status(404).end();
      }

      let csrf = new Field({ type: 'hidden', name: '_csrf', value: csrfToken });
      let tokenField = new Field({ type: 'hidden', name: 'token', value: token });
      let password = new Field({ type: 'password', name: 'password', label: 'New Password' });
      let confirmPassword = new Field({ type: 'password', name: 'confirmPassword', label: 'Confirm New Password' });
      res.render('password-reset/password-reset.jade', {
        fields: [ csrf, tokenField, password, confirmPassword ],
        token,
      })
    }

    renderPasswordReset(req, res, next).catch((err) => {
      next(err);
    });
  });

  router.post('/password-reset/:token/', csrfProtection(app), (req, res, next) => {
    async function changePassword(req, res, next) {
      let token = req.params.token;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      if (password !== confirmPassword) {
        return res.status(422).send({
          errors: {
            password: ['Passwords don\'t match']
          }
        });
      }

      let resetObj = await PasswordReset.find({ token }).limit(1).next();
      if (!resetObj) {
        return res.status(422).send({
          errors: {
            token: ['Invalid token']
          }
        });
      }

      password = hash(password);

      let email = resetObj.email;
      let user = await User.find({ email }).limit(1).next();
      if (!user) {
        return res.status(422).send({
          errors: {
            user: ['User not found']
          }
        });
      }

      await User.update({ email }, { $set: { password } });
      await PasswordReset.remove({ email, token })

      return res.status(200).send({
        success: true
      });
    }

    changePassword(req, res, next).catch((err) => {
      next(err);
    });
  });

}


module.exports = { registerRoutes }
