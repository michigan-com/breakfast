'use strict';

import { loginRequired } from '../middleware/login';
import { basicFonts, usatFonts } from '../util/fonts';

/**
 * Register the routes for LogoFetch. Registers URLs for getting
 * default logos, and for URLs to color the logos
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router) {
  router.get('/fonts/getFonts/', loginRequired, (req, res) => {
    let fonts = basicFonts.slice(); // copies the array
    fonts = fonts.concat(usatFonts);
    fonts = fonts.sort((a, b) => (b - a));
    res.json({ fonts });
  });
}

module.exports = { registerRoutes };
