import { equal, notEqual } from 'assert';

import request from 'supertest';

import { createApp } from '../../dist/app';
import dbConnect from '../../dist/util/dbConnect';
import { hash } from '../../dist/util/hash';

import { testGetRoute, testPostRoute } from './util';

var db, Invite, app, agent;

let testEmail = 'test@michigan.com';
let testPassword = 'test';

let defaultEmail = 'testemail@michigan.com';
let defaultPassword = 'test';

if (!process.env.TEST_DB_URI) throw new Error('Please set the TEST_DB_URI env variable');

describe('Registration testing', function() {

  before(function(done) {
    async function init(done) {
      db = await dbConnect(process.env.TEST_DB_URI);
      Invite = db.collection('Invite');
      let User = db.collection('User');

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

  it('Tests the /register/ get route', async (done) => {
    let res = await testGetRoute(agent, '/register/')
    done();
  });

  it('Tests registering with an invalid email', async (done) => {
    let res = await testPostRoute(agent, '/register/', {
      email: 'asdfasdf'
    }, 422);
    equal('email' in res.body.error, true, 'Should have email error in response body');
    done();
  });

  it('Tests registering with an already-existing user', async (done) => {
    let res = await testPostRoute(agent, '/register/', {
      email: defaultEmail
    }, 422);
    equal('username' in res.body.error, true, 'Should have username error in response body');
    done();
  });

  it('Tests registering with a new email', async (done) => {
    let res = await testPostRoute(agent, '/register/', {
      email: testEmail
    }, 200);

    equal(res.status, 200, 'Should have been redirected fine');
    equal('success' in res.body, true, 'Success value dones\'t exist in response body');
    equal(res.body.success, true, 'Should be a true success value');

    let invite = await Invite.find({ email: testEmail }).limit(1).next();

    equal(invite.email, testEmail, 'Invite not saved in the DB');
    done();
  });

  it('Tests registering with an already invited user', async (done) => {
    let count = await Invite.count({ email: testEmail });
    equal(count, 1, 'Should only be one invite');

    let res = await testPostRoute(agent, '/register/', {
      email: testEmail
    }, 200);

    let expectedUrl = `/register/email-sent/${testEmail}`;
    equal(res.status, 200, 'Should have been redirected fine');
    equal('success' in res.body, true, 'Success value dones\'t exist in response body');
    equal(res.body.success, true, 'Should be a true success value');

    count = await Invite.count({ email: testEmail });
    equal(count, 1, 'Should not have created a second invite');
    done();
  });

  it('Tests when user tries to create an account with two different passwords', async function(done) {
    let invite = await Invite.find({ email: testEmail }).limit(1).next();

    let res = await testPostRoute(agent, '/create-user/', {
      email: testEmail,
      token: invite.token,
      password: 'pwd1',
      confirmPassword: 'pwd2'
    }, 422);

    equal('errors' in res.body, true, 'Should have "errors" in response body');
    equal('password' in res.body.errors, true, 'Should have a password error in response body');
    done();
  });

  it('Tests when a user tries to create an account with an invalid token', async function(done) {
    let res = await testPostRoute(agent, '/create-user/', {
      email: testEmail,
      token: 'inavlid token',
      password: 'pwd1',
      confirmPassword: 'pwd1'
    }, 302);
    equal(res.header.location, '/register/', 'Should be redirecting to the register page');
    done();
  });

  it('Tests when a user tries to create an account before being invited', async (done) => {
    let res = await testPostRoute(agent, '/create-user/', {
      email: 'This email hasnt been invited',
      password: 'asdf',
      confirmPassword: 'asdf'
    }, 302);
    equal(res.header.location, '/register/', 'Should have forwarded to the /register/ url');
    done();
  });

  it('Tests a valid registration', async function(done) {
    let invite = await Invite.find({ email: testEmail }).limit(1).next();
    let res = await testPostRoute(agent, '/create-user/', {
      email: testEmail,
      token: invite.token,
      password: 'asdf',
      confirmPassword: 'asdf'
    }, 302)
    equal(res.header.location, '/breakfast/', 'Should have forwarded to /breakfast/ url');
    done();

      // TODO will be this when we send emails
      // .end(async function(err, res) {
      //   if (err) throw new Error(err);

      //   equal(res.status, 200);
      //   equal(res.body.success, true, 'SHould have success: true');
      //   equal(res.body.user, testEmail, 'Should have included email in response');

      //   // Make sure the invite got deleted
      //   let invite = await Invite.find({ email: testEmail }).limit(1).next();
      //   equal(!!invite, false, 'Should be no invite');

      //   done();
      // });
  });

})
