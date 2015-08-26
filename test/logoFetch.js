import LogoFetch from '../src/logoFetch';
import { ok, equal, notEqual } from 'assert';

let logoFetch = new LogoFetch();
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

  it('Tests the coloring of the logo', async function() {
    let color = '#eeeeee';
    let data = await logoFetch.getLogo(logoFiles[0], color);

    let matches = logoFetch.colorRegex.exec(data);

    for (var match of matches) {
      notEqual(match.indexOf(color), -1, `Color ${color} should be in the match`);
    }
  });
});
