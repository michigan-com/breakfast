import fs from 'fs';
import path from 'path';
import { PACKAGE_DIR } from '../constants';

var LOGO_ROOT = path.join(PACKAGE_DIR, 'public', 'img', 'logos');

class LogoFetch {
  constructor() {
    this.colorRegex = /<path fill="#[a-fA-F0-9]+"/g;
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

    let data = await this.readFile_(path.join(LOGO_ROOT, filename));

    if (color) {
      data = this.colorLogo(data, color);
    }

    return data;
  }

  async getAllLogos() {
    let files = await this.getAllLogos_();
    return files;
  }

  colorLogo(data, color) {
    if (color.length && color[0] !== '#') color = `#${color}`
    return data.replace(this.colorRegex, `<path fill="${color}"`);
  }

  /**
   * Promise-based reading of the files in the logo directory
   */
  getAllLogos_() {
    return new Promise(function(resolve, reject) {
      fs.readdir(LOGO_ROOT, function(err, files) {
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
 * @param {Object} router - express.Router() instance
 */
function registerRoutes(router, passport) {
  let logoFetch = new LogoFetch();

  router.get('/logos/:color/:filename', handleGetLogo);
  router.get('/logos/:filename', handleGetLogo);

  function handleGetLogo(req, res, next) {
    return getLogo(req, res, next).catch(function(err) {
      next(err);
    });
  }

  async function getLogo(req, res, next) {
    let color = 'color' in req.params ? req.params.color : undefined;
    let filename = req.params.filename;

    let data = await logoFetch.getLogo(filename, color);

    res.set({
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=0',
      'Content-Type': 'image/svg+xml',
      'Content-Length': data.length
    }).send(data);
  }
}

module.exports = {
  registerRoutes
}
