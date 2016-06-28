'use strict';

import fs from 'fs';
import path from 'path';

import cheerio from 'cheerio';

import env from '../env';
import { loginRequired } from '../middleware/login';
import { getDomainFromEmail } from '../util/parse';
import dir from '../util/dir';
import logoJson from '../../logoInfo.json';

const LOGO_ROOT = dir('logos');

class LogoFetch {
  constructor(logoRoot = LOGO_ROOT) {
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

    let data = await this.readFile(path.join(this.logoRoot, filename));

    if (color) {
      data = this.colorLogo(data, color);
    }
    return data;
  }

  async getAllLogos() {
    const files = await this.readLogoFile(this.logoRoot);
    return files;
  }

  colorLogo(data, color) {
    const $ = cheerio.load(data, {
      xmlMode: true,
    });
    $('g:not(.no-color-change)').attr('style', 'filter: none;');

    $('path, text, circle, polyline, polygon').each((index, obj) => {
      if ($(obj).hasClass('no-color-change')) return;
      else if ($(obj).parents('defs').length) return;

      let style = 'filter: none;';
      if ($(obj).get(0).tagName !== 'circle') style += `fill: #${color};`;

      $(obj).attr('style', style);
    });

    // Remove filters? Idk what they do but they mess stuff up
    $('filter').remove();

    return $.html();
  }

  /**
   * Promise-based reading of the files in the logo directory
   */
  readLogoFile(folder) {
    return new Promise((resolve, reject) => {
      fs.readdir(folder, (err, files) => {
        if (err) reject(err);

        resolve(files);
      });
    });
  }

  /**
   * Promise-based reading of file
   */
  readFile(filepath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, 'utf-8', (err, data) => {
        if (err) return reject(err);

        return resolve(data);
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
function registerRoutes(app, router) {
  const logoFetch = new LogoFetch();

  /**
   * Determins whether a user has access to a specific logo file or not.
   *
   * @param {Object} logoInfo - logoJson[market] = logoInfo, see logoInfo.json
   * @param {Object} user - User Object in mongo, from the request object
   * @returns {Boolean} true if the user has access, false otherwise
   */
  function userHasAccess(logoInfo, user) {
    const domain = getDomainFromEmail(user.email);

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
  router.get('/logos/getLogos/', loginRequired, (req, res) => {
    const approvedLogos = {};
    Object.keys(logoJson).forEach((filename) => {
      const logoInfo = { ...logoJson[filename] };
      if (userHasAccess(logoInfo, req.user)) {
        approvedLogos[filename] = logoInfo;
      }
    });
    res.json(approvedLogos);
  });

  async function getLogo(req, res) {
    const color = 'color' in req.query ? req.query.color : undefined;
    const filename = req.params.filename;
    const logoInfo = logoJson[filename];

    const data = await logoFetch.getLogo(filename, color);

    if (logoInfo.isSvg) {
      res.set({
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=0',
        'Content-Type': 'image/svg+xml',
        'Content-Length': data.length,
      }).send(data);
    } else {
      res.redirect(`/img/logos/${filename}`);
    }
  }

  // Getting the logo files
  router.get('/logos/:filename', (req, res, next) => {
    getLogo(req, res, next).catch((err) => {
      next(err);
    });
  });
}

module.exports = {
  registerRoutes,
  LogoFetch,
};
