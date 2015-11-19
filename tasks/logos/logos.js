var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

var ROOT_DIR = path.join(__dirname, '..', '..');

var marketInfo = require(path.join(ROOT_DIR, 'marketInfo.json'));

/**
 * Generate some basic stats on the logos we currently have in the system,
 * so we don't have to read the image width/height every time someone
 * changes a logo.
 *
 * Find ./public/img/logo/*.svg, parses the file contents for the width and the
 * height, and saves the information in ./public/js/lib/logos.json
 */
gulp.task('generateLogoJson', function() {
  var logo_root = path.join(ROOT_DIR, 'public', 'img', 'logos');
  var outfile = path.join(ROOT_DIR, 'logoInfo.json');
  var ratioRegex = /width="(\d+(?:\.\d+)?)(?:px)?"\s+height="(\d+(?:\.\d+)?)(?:px)?"/;
  var logoNames = getLogoNames();

  var files = fs.readdirSync(logo_root);
  var logoJson = {};
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!/\.svg$/.exec(file)) continue;

    if (!(file in logoNames)) {
      console.error('Need to specify name for ' + file + ' in the logoNames object in the generateLogoJson gulp task');
      continue;
    }

    var contents = fs.readFileSync(path.join(logo_root, file));

    var match = ratioRegex.exec(contents);
    if (!match) {
      console.error('Can\'t find height/width for ' + file);
      continue;
    }

    logoJson[file] = {
      width: match[1],
      height: match[2],
      aspectRatio: match[1] / match[2],
      name: file,
      domain: logoNames[file]
    }
  }
  fs.writeFile(outfile, JSON.stringify(logoJson, null, 2), function(err) {
    if (err) throw new Error(err);

    console.log('Saved ' + outfile);
  })
  console.log(logoJson);
});

function getLogoNames() {
  var logoNames = {};
  for (var marketName in marketInfo) {
    var market = marketInfo[marketName]
    var logos = market.logo;
    if (!logos) continue;

    if (!Array.isArray(logos)) logos = [logos];
    for (var i = 0; i < logos.length; i++) {
      logoNames[logos[i].filename] = market.domain;
    }
  }

  return logoNames;
}
