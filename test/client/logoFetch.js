import path from 'path';

import '../../dist/env';
import dir from '../../dist/util/dir';
import { LogoFetch } from '../../dist/routes/logoFetch';
import { ok, equal, notEqual } from 'assert';

let logoFetch = new LogoFetch(dir('logos'));
let logoFiles;

describe('Testing logo fetching', function() {

  before(async function() {
    logoFiles = await logoFetch.getAllLogos();
  });

  it('tests the presence of files', async function() {
    let result = await logoFetch.getLogo('asdfasdf');
    equal(result, null, 'This filename shouldn\'t show up');

    for (let logoFilename of logoFiles) {
      result = await logoFetch.getLogo(logoFilename);

      notEqual(result, null, 'Shuld be file contents');
    }
  });
});
