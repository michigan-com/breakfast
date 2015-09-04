import { equal, notEqual } from 'assert';

import request from 'supertest';

import { createApp } from '../../dist/app';
import { createTables } from '../../tasks/db/create';
import { dropTables } from '../../tasks/db/drop';

let app = createApp(process.env.TEST_DB_URI, false);
let db = app.get('db');
let Invite = db.Invite;
let agent = request.agent(app);

let testEmail = 'test@test.com';
let testPassword = 'test';

let defaultEmail = 'testemail@testemail.com';
let defaultPassword = 'test';

describe('Registration testing', function() {
  // TODO abstract this
  before(async function(done) {
    createTables(db, function() {
      db.User.create({
        email: defaultEmail,
        password: defaultPassword
      }).then(function() {
        done();
      });
    });
  });

  after(function(done) {
    dropTables(app.get('db'), done);
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

  it('Tests registering with an already-existing user', function(done) {
    agent
      .post('/register/')
      .send({
        email: defaultEmail
      })
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 200, 'Should have been redirected okay');
        equal(res.req.path, '/register/', 'Should still be on the register page with an error message');
        done();
      });
  });

  it('Tests registering with a new email', function(done) {
    async function checkInvites(email, done) {
      let invite = await Invite.findOne({
        where : {
          email
        }
      });

      equal(invite.email, email, 'Invite not saved in the DB');
      done();
    }

    agent
      .post('/register/')
      .send({
        email: testEmail
      })
      .redirects()
      .end(function(err, res) {
        if (err) throw new Error(err);

        let expectedUrl = `/register/email-sent/${testEmail}`;
        equal(res.status, 200, 'Should have been redirected fine');
        equal(res.req.path, expectedUrl, `Should have been redirected to ${expectedUrl}`)
        checkInvites(testEmail, done).catch(function(err) {
          throw new Error(err);
        });
      })
  });

  it('Tests registering with an already invited user', async function(done) {
    let count = await Invite.count({ where: { email: testEmail }});
    equal(count, 1, 'Should only be one invite');

    agent
      .post('/register/')
      .send({
        email: testEmail
      })
      .redirects()
      .end(async function(err, res) {
        if (err) throw new Error(err);

        let expectedUrl = `/register/email-sent/${testEmail}`;
        equal(res.status, 200, 'Should have been redirected fine');
        equal(res.req.path, expectedUrl, `Should have been redirected to ${expectedUrl}`)

        let count = await Invite.count({ where: { email: testEmail }});
        equal(count, 1, 'Should not have created a second invite');

        done();
      })
  });

  it('Tests when user tries to create an account with two different passwords', async function(done) {
    let invite = await Invite.findOne({ where: { email: testEmail }});

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

        equal(res.status, 422, 'Should have returned a 422 error for invalid token');
        equal('errors' in res.body, true, 'Should have "errors" in the response body');
        equal('token' in res.body.errors, true, 'Should have a token error in the response body');
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
    let invite = await Invite.findOne({ where: { email: testEmail }});

    agent
      .post('/create-user/')
      .send({
        email: testEmail,
        token: invite.token,
        password: 'asdf',
        confirmPassword: 'asdf'
      })
      .end(async function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 200);
        equal(res.body.success, true, 'SHould have success: true');
        equal(res.body.user, testEmail, 'Should have included email in response');

        // Make sure the invite got deleted
        let invite = await Invite.findOne({ where: { email: testEmail }});
        equal(!!invite, false, 'Should be no invite');

        done();
      });
  });

})
