import { equal, notEqual } from 'assert';

import request from 'supertest';
import cheerio from 'cheerio';

import { createApp } from '../../dist/app';
import dbConnect from '../../dist/util/dbConnect';
import { hash } from '../../dist/util/hash';

import { testGetRoute, testPostRoute } from './util.js';

var db, PasswordReset, User, app, agent;

let testEmail = 'test@michigan.com';
let testPassword = 'test';

let defaultEmail = 'testemail@michigan.com';
let defaultPassword = 'test';

if (!process.env.TEST_DB_URI) throw new Error('Please set the TEST_DB_URI env variable');

describe('Password reset testing', () => {

  before(function(done) {
    async function init(done) {
      db = await dbConnect(process.env.TEST_DB_URI);
      PasswordReset = db.collection('PasswordReset');
      User = db.collection('User');

      // Create the default User
      let user = await User.insertOne({ email: defaultEmail, password: hash(defaultPassword) });

      app = createApp(db, false);
      agent = request.agent(app);

      done();
    }

    init(done).catch(function(e) { throw new Error(e) });
  });

  after(async function(done) {
    await db.dropDatabase();

    done();
  });

  it ('Tests the /password-reset/ get route', async (done) => {
    let res = await testGetRoute(agent, '/password-reset/')
    done();
  });

  it('Tests requesting a password reset token with an inavlid email', async (done) => {
    let res = await testPostRoute(agent, '/password-reset/', { email: 'asdasdf' }, 422);
    equal('email' in res.body.error, true, 'Should have email in the errors');
    done();
  });

  it('Tests requesting a password reset with a valid, but not yet registered email', async (done) => {
    let res = await testPostRoute(agent, '/password-reset/', { email: testEmail }, 422);
    equal('user' in res.body.error, true, 'Should have user in the errors')
    done();
  });

  it('Tests requesting a password reset with a valid email', async (done) => {
    let res = await testPostRoute(agent, '/password-reset/', { email: defaultEmail }, 200);

    let count = await PasswordReset.count({ email: defaultEmail });
    equal(count, 1, 'Should be one password reset object for this email')
    done();
  });

  it('Tests an invalid password reset token', async (done) => {
    // Should 404
    let fakeToken = 'asdfasdf';
    let res = await testGetRoute(agent, `/password-token/${fakeToken}/`, 404);
    done();
  });

  it('Tests a valid password reset token', async (done) => {
    let resetObj = await PasswordReset.find({ email: defaultEmail }).limit(1).next();
    let token = resetObj.token;
    let res = await testGetRoute(agent, `/password-reset/${token}/`, 200);

    let $ = cheerio.load(res.text);
    try {
      equal($('.token input').val(), token, 'Should be a token input')
    } catch(e) {
      return done(e);
    }
    done();
  });

  it('Tests posting non-matching passwords', async (done) => {
    let resetObj = await PasswordReset.find({ email: defaultEmail }).limit(1).next();
    let token = resetObj.token;
    let url = `/password-reset/${token}/`;

    let res = await testPostRoute(agent, url, {
      password: '123',
      confirmPassword: '1234'
    }, 422);
    try {
      equal('password' in res.body.errors, true, 'Should have a password error');
    } catch(e) {
      return done(e);
    }
    done();
  });

  it('Tests posting a new password', async (done) => {
    let resetObj = await PasswordReset.find({ email: defaultEmail }).limit(1).next();
    let token = resetObj.token;
    let url = `/password-reset/${token}/`;
    let newPassword = `fancy-new-password-${new Date()}`;
    let hashedPwd = hash(newPassword);

    let res = await testPostRoute(agent, url, {
      password: newPassword,
      confirmPassword: newPassword,
    }, 200);

    try {
      let count = await PasswordReset.count({ email: defaultEmail });
      let user = await User.find({ email: defaultEmail }).limit(1).next();
      equal(count, 0, 'Should be no PasswordReset documents');
      equal(user.password, hashedPwd, 'Passwords dont match');
    } catch(e) {
      return done(e);
    }
    done();
  });
});
