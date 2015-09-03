import request from 'supertest';

import { createApp } from '../../src/server/app';
import { createTables } from '../../tasks/db/create';
import { dropTables } from '../../tasks/db/drop';

let app = createApp(process.env.TEST_DB_URI);
let agent = request.agent(app);

describe('Route testing', function() {
  before(function(done) {
    createTables(app.get('db'), done);
  });

  after(function(done) {
    dropTables(app.get('db'), done);
  })

  it('Test to make sure you have to be logged in for /breakfast/ url', function(done) {

    agent
      .get('/breakfast/')
      .expect('Location', '/login/')
      .end(done);
  });

});
