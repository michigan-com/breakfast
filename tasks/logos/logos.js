var fs = require('fs');
var path = require('path');

var gulp = require('gulp');

var ROOT_DIR = path.join(__dirname, '..', '..')

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
  var ratioRegex = /width="(\d+(?:\.\d+)?)px"\s+height="(\d+(?:\.\d+)?)px"/;
  var logoNames = {
    'dfp.svg': {
      name: 'Detroit Free Press',
      domain: 'freepress.com'
    },

    'dn.svg': {
      name: 'Detroit News',
      domain: 'detroitnews.com'
    },

    'michigan.svg': {
      name: 'Michigan.com',
      domain: 'michigan.com'
    }
  };

  var files = fs.readdirSync(logo_root);
  var logoJson = {};
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (!/\.svg$/.exec(file)) continue;

    if (!(file in logoNames)) {
      throw new Error('Need to specify name for ' + file + ' in the logoNames object in the generateLogoJson gulp task');
    }

    var contents = fs.readFileSync(path.join(logo_root, file));

    var match = ratioRegex.exec(contents);
    if (!match) {
      throw new Error('Can\'t find height/width for ' + file);
    }

    logoJson[file] = {
      width: match[1],
      height: match[2],
      aspectRatio: match[1] / match[2],
      name: logoNames[file].name,
      domain: logoNames[file].domain
    }
  }
  fs.writeFile(outfile, JSON.stringify(logoJson), function(err) {
    if (err) throw new Error(err);

    console.log('Saved ' + outfile);
  })
  console.log(logoJson);
});
