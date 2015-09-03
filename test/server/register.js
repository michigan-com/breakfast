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
  })
})
