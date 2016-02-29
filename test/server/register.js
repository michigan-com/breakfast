import { equal, notEqual } from 'assert';

import request from 'supertest';

import { createApp } from '../../dist/app';
import dbConnect from '../../dist/util/dbConnect';
import { hash } from '../../dist/util/hash';

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

  it('Tests the /register/ get route', function(done) {
    agent
      .get('/register/')
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 200, 'Should have returned a 200');
        done();
      });
  });

  it('Tests registering with an invalid email', function(done) {
    agent
      .post('/register/')
      .send({
        email: 'asdfasdf'
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 422, 'Status should be 422');
        equal('email' in res.body.error, true, 'Should have email error in response body');
        done();
      });
  })

  it('Tests registering with an already-existing user', function(done) {
    agent
      .post('/register/')
      .send({
        email: defaultEmail
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 422, 'Should have generated a 422 error');
        equal('username' in res.body.error, true, 'Should have username error in response body');
        done();
      });
  });

  it('Tests registering with a new email', function(done) {
    async function checkInvites(email, done) {
      let invite = await Invite.find({ email }).limit(1).next();

      equal(invite.email, email, 'Invite not saved in the DB');
      done();
    }

    agent
      .post('/register/')
      .send({
        email: testEmail
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 200, 'Should have been redirected fine');
        equal('success' in res.body, true, 'Success value dones\'t exist in response body');
        equal(res.body.success, true, 'Should be a true success value');
        checkInvites(testEmail, done).catch(function(err) {
          throw new Error(err);
        });
      })
  });

  it('Tests registering with an already invited user', async function(done) {
    let count = await Invite.count({ email: testEmail });
    equal(count, 1, 'Should only be one invite');

    async function checkInvites(done) {
      let count = await Invite.count({ email: testEmail });
      equal(count, 1, 'Should not have created a second invite');

      done();
    }

    agent
      .post('/register/')
      .send({
        email: testEmail
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        let expectedUrl = `/register/email-sent/${testEmail}`;
        equal(res.status, 200, 'Should have been redirected fine');
        equal('success' in res.body, true, 'Success value dones\'t exist in response body');
        equal(res.body.success, true, 'Should be a true success value');

        checkInvites(done).catch(function(err) {
          throw new Error(err);
        });
      });
  });

  it('Tests when user tries to create an account with two different passwords', async function(done) {
    let invite = await Invite.find({ email: testEmail }).limit(1).next();

    agent
      .post('/create-user/')
      .send({
        email: testEmail,
        token: invite.token,
        password: 'pwd1',
        confirmPassword: 'pwd2'
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 422, 'Should have returned a 422 error for mismatched pwds');
        equal('errors' in res.body, true, 'Should have "errors" in response body');
        equal('password' in res.body.errors, true, 'Should have a password error in response body');
        done();
      });
  });

  it('Tests when a user tries to create an account with an invalid token', async function(done) {
    agent
      .post('/create-user/')
      .send({
        email: testEmail,
        token: 'inavlid token',
        password: 'pwd1',
        confirmPassword: 'pwd1'
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 302, 'Should have returned a 302 redirect, invalid token means no invite');
        equal(res.header.location, '/register/', 'Should be redirecting to the register page');
        done();
      })
  });

  it('Tests when a user tries to create an account before being invited', function(done) {
    agent
      .post('/create-user/')
      .send({
        email: 'This email hasnt been invited',
        password: 'asdf',
        confirmPassword: 'asdf'
      })
      .redirects()
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.req.path, '/register/', 'Should have forwarded to the /register/ url');
        done();
      });
  });

  it('Tests a valid registration', async function(done) {
    let invite = await Invite.find({ email: testEmail }).limit(1).next();

    agent
      .post('/create-user/')
      .send({
        email: testEmail,
        token: invite.token,
        password: 'asdf',
        confirmPassword: 'asdf'
      })
      .redirects()
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.req.path, '/breakfast/', 'Should have forwarded to /breakfast/ url');
        done();
      })

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
