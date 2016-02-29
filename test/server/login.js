import { equal, notEqual } from 'assert';

import request from 'supertest';

import { createApp } from '../../dist/app';
import dbConnect from '../../dist/util/dbConnect';
import { hash } from '../../dist/util/hash';

import { testGetRoute, testExpectedRedirect, testPostRoute } from './util';

var db, Invite, app, agent;

let defaultEmail = 'testemail@testemail.com';
let defaultPassword = 'test';

if (!process.env.TEST_DB_URI) throw new Error('Please set the TEST_DB_URI env variable');

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

  it('Test to make sure you have to be logged in for /breakfast/ url', async (done) => {
    await testExpectedRedirect(agent, '/breakfast/', '/login/');
    done();
  });

  it('Tests an unsuccessful login', async (done) => {
    let res = await testPostRoute(agent, '/login/', {
      email: 'inavlid email',
      password: 'asdfasdfasdf'
    }, 302)
    equal(res.header.location, '/login/', 'Should have redirected to login');

    done();
  })

  it('Tests a successful login and redirect', async (done) => {
    let res = await testPostRoute(agent, '/login/', {
      email: defaultEmail,
      password: defaultPassword
    }, 302);

    equal(res.header.location, '/breakfast/', 'Should have redirected to /breakfast/');
    done();
  });

  it('Tests going to /breakfast/ after a login', async function(done) {
    // NOTE: Expected login in the previous test
    let res = await testGetRoute(agent, '/breakfast/');
    done();
  });

  it('Tests the logout', async (done) => {
    let res = await testGetRoute(agent, '/logout/', 302)
    equal(res.header.location, '/', 'Should have redirected to the index page');
    done();
  });

  it('Test the /breakfast/ url after the logout', async (done) => {
    let res = await testGetRoute(agent, '/breakfast/', 302);
    equal(res.header.location, '/login/', 'Should have redirected to the login page');
    done();
  });
});
