import fs from 'fs';
import path from 'path';

import debug from 'debug';
import cheerio from 'cheerio';

import env from '../env';
import { loginRequired } from '../middleware/login';
import { getDomainFromEmail } from '../util/parse';
import dir from '../util/dir';
import logoJson from '../../logoInfo.json';

var logger = debug('breakfast:logoFetch');

var LOGO_ROOT = dir('logos');

class LogoFetch {
  constructor(logoRoot=LOGO_ROOT) {
    this.logoRoot = logoRoot;
  }


  /**
   * Get the logo based on the filename. Can specify an optional color that
   * will overrite the <path fill='[color]'> values
   *
   * @memberof LogoFetch
   * @param {String} filename - Name of a logo file found in LOGO_ROOT
   * @param {String} color - (Optional) Hex string representing the color to
   *  fill the paths in. If not specified, no color substitution will occur
   * @return {String/null} Will return file contents if logo specified by
   *  filename is found, null otherwise
   */
  async getLogo(filename, color) {
    if (!this.logos || !this.logos.length) {
      this.logos = await this.getAllLogos();
    }

    if (this.logos.indexOf(filename) < 0) return null;

    let data = await this.readFile_(path.join(this.logoRoot, filename));

    if (color) {
      data = this.colorLogo(data, color);
    }
    return data;
  }

  async getAllLogos() {
    let files = await this.getAllLogos_(this.logoRoot);
    return files;
  }

  colorLogo(data, color) {
    let $ = cheerio.load(data, {
      xmlMode: true,
    });
    $('g:not(.no-color-change)').attr('style', 'filter: none;');

    $('path, text, circle').each(function(index, obj) {
      if ($(obj).hasClass('no-color-change')) return;
      else if ($(obj).parents('defs').length) return;

      let style = `filter: none;`;
      if ($(obj).get(0).tagName !== 'circle') style += `fill: #${color};`

      $(obj).attr('style', style);
    });

    // Remove filters? Idk what they do but they mess stuff up
    $('filter').remove();

    return $.html();
  }

  /**
   * Promise-based reading of the files in the logo directory
   */
  getAllLogos_(folder) {
    return new Promise(function(resolve, reject) {
      fs.readdir(folder, function(err, files) {
        if (err) reject(err);

        resolve(files);
      });

    });
  }

  /**
   * Promise-based reading of file
   */
  readFile_(filepath) {
    return new Promise(function(resolve, reject){
      fs.readFile(filepath, 'utf-8', function(err, data){
        if (err) reject(err);

        resolve(data);
      });
    });
  }
}


/**
 * Register the routes for LogoFetch. Registers URLs for getting
 * default logos, and for URLs to color the logos
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  let logoFetch = new LogoFetch();

  /**
   * Determins whether a user has access to a specific logo file or not.
   *
   * @param {Object} logoInfo - logoJson[market] = logoInfo, see logoInfo.json
   * @param {Object} user - User Object in mongo, from the request object
   * @returns {Boolean} true if the user has access, false otherwise
   */
  function userHasAccess(logoInfo, user) {
    let domain = getDomainFromEmail(user.email);

    if (logoInfo.domain.indexOf(domain) >= 0) {
      return true;
    } else if (logoInfo.domain.indexOf('*') >= 0) {
      return true;
    } else if (user.admin) {
      return true;
    }

    return false;
  }

  // Getting the logo info
  router.get('/logos/getLogos/', loginRequired, function(req, res, next) {
    let approvedLogos = {};
    for (let filename in logoJson) {
      let logoInfo = Object.assign({}, logoJson[filename]);
      if (userHasAccess(logoInfo, req.user)) {
        approvedLogos[filename] = logoInfo;
      }
    }
    res.json(approvedLogos);
  });

  // Getting the logo files
  router.get('/logos/:filename', (req, res, next) => {
    return getLogo(req, res, next).catch(function(err) {
      next(err);
    });
  });

  async function getLogo(req, res, next) {
    let color = 'color' in req.query ? req.query.color : undefined;
    let filename = req.params.filename;
    let logoInfo = logoJson[filename];

    let data = await logoFetch.getLogo(filename, color);

    if (logoInfo.isSvg) {
      res.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=0',
        'Content-Type': 'image/svg+xml',
        'Content-Length': data.length
      }).send(data);
    } else {
      res.redirect(`/img/logos/${filename}`);
    }
  }


}

module.exports = {
  registerRoutes,
  LogoFetch
}
