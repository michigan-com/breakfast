import { equal, notEqual } from 'assert';

import request from 'supertest';

import { createApp } from '../../dist/app';
import dbConnect from '../../dist/util/dbConnect';
import { hash } from '../../dist/util/hash';

var db, Invite, app, agent;

let defaultEmail = 'testemail@testemail.com';
let defaultPassword = 'test';

describe('Route testing', function() {
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

  it('Test to make sure you have to be logged in for /breakfast/ url', function(done) {
    agent
      .get('/breakfast/')
      .expect('Location', '/login/')
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 302);
        done();
      });
  });

  it('Tests an unsuccessful login', function(done) {
    agent
      .post('/login/')
      .send({
        email: 'inavlid email',
        password: 'asdfasdfasdf'
      })
      .expect('Location', '/login/')
      .end(function(err, res) {
        done();
      });

  })

  it('Tests a successful login', function(done) {
    agent
      .post('/login/')
      .send({
        email: defaultEmail,
        password: defaultPassword
      })
      .expect('Location', '/breakfast/')
      .end(done);
  });

  it('Tests going to /breakfast/ after a login', function(done) {
    // NOTE: Expected login in the previous test
    agent
      .get('/breakfast/')
      .end(function(err, res) {
        if (err) throw new Error(err);

        equal(res.status, 200, 'Should have directed to the /breakfast/ page fine');
        done();
      });
  });

  it('Tests the logout', function(done) {
    agent
      .get('/logout/')
      .expect('Location', '/')
      .redirects()
      .end(function(err, res) {
        equal(res.req.path, '/', 'Should have redirected to the index page');
        done();
      });
  });

  it('Test the /breakfast/ url after the logout', function(done) {
    agent
      .get('/breakfast/')
      .redirects()
      .end(function(err, res) {
        equal(res.req.path, '/login/', 'Should have redirected to the login page');
        done();
      });
  });
});
