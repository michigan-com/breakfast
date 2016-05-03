var fs = require('fs');
var path = require('path');

var ROOT_DIR = path.join(__dirname);

var marketInfo = require(path.join(__dirname, 'marketInfo.json'));

/**
 * Generate some basic stats on the logos we currently have in the system,
 * so we don't have to read the image width/height every time someone
 * changes a logo.
 *
 * Find ./public/img/logo/*.svg, parses the file contents for the width and the
 * height, and saves the information in ./public/js/lib/logos.json
 */
function generateLogoJson() {
  var logo_root = path.join(ROOT_DIR, 'public', 'img', 'logos');
  var outfile = path.join(ROOT_DIR, 'logoInfo.json');
  var ratioRegex = /width="(\d+(?:\.\d+)?)(?:px)?"\s+height="(\d+(?:\.\d+)?)(?:px)?"/;
  var viewboxRegex = /viewBox="\d+\s+\d+\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)"/;
  var logoNames = getLogoNames();

  var files = fs.readdirSync(logo_root);
  var logoJson = {};
  var unusedFiles = [];
  var invalidFiles = [];
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var isSvg = /svg$/.test(file);

    if (!(file in logoNames)) {
      unusedFiles.push(file);
      continue;
    }

    var contents = fs.readFileSync(path.join(logo_root, file));
    logoJson[file] = {
      name: file,
      domain: logoNames[file].domain,
      isSvg: isSvg,
      noColor: logoNames[file].noColor
    }

    // Do some calculations based the name
    if(isSvg) {
      var match = ratioRegex.exec(contents);
      if (!match) {
        match = viewboxRegex.exec(contents);
        if (!match) {
          invalidFiles.push('Can\'t find height/width for ' + file);
          continue;
        }
      }

      logoJson[file].width = match[1];
      logoJson[file].height = match[2];
      logoJson[file].aspectRatio = match[1] / match[2];
    }

    logoNames[file].logoFound = true;
  }
  fs.writeFile(outfile, JSON.stringify(logoJson, null, 2), function(err) {
    if (err) throw new Error(err);

    console.log('Saved ' + outfile);
  });

  var logosNotFound = [];
  for (var logo in logoNames) {
    var logoInfo = logoNames[logo];
    if (logoInfo.logoFound) continue;

    logosNotFound.push('Logo not found for ' + logoInfo.domain + ' (' + logo + ')');
  }

  // Display stats
  if (invalidFiles.length) printLogoBreakdown('Invalid Files', invalidFiles);
  if (unusedFiles.length) printLogoBreakdown('Unused Logo Files', unusedFiles);
  if (logosNotFound.length) printLogoBreakdown('Logos not found', logosNotFound);
}

function getLogoNames() {
  var logoNames = {};
  for (var marketName in marketInfo) {
    var market = marketInfo[marketName]
    var logos = market.logo;
    if (!logos) continue;

    if (!Array.isArray(logos)) logos = [logos];
    for (var i = 0; i < logos.length; i++) {
      var filename = logos[i].filename;
      if (!(filename in logoNames)) {
        logoNames[filename] = {
          domain: [],
          logoFound: false,
          noColor: logos[i].noColor || false
        }
      }

      logoNames[filename].domain.push(market.domain);
    }
  }

  return logoNames;
}

function printLogoBreakdown(breakdownName, infoArray) {
  console.log(breakdownName);
  console.log('--------------------------------------------------------------------------------');

  for (var i = 0; i < infoArray.length; i++) {
    console.log('\t' + infoArray[i]);
  }

  console.log('--------------------------------------------------------------------------------');
  console.log('\n')
}

generateLogoJson();
