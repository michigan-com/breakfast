'use strict';

import { loginRequired } from '../middleware/login';
import { basicFonts, usatFonts } from '../util/fonts';
import { getDomainFromEmail } from '../util/parse';

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
    const domain = getDomainFromEmail(req.user.email);
    let fonts = basicFonts.slice(); // copies the array

    if (domain === 'usatoday.com' || req.user.admin) fonts = fonts.concat(usatFonts);
    fonts = fonts.sort((a, b) => (b - a));
    res.json({ fonts });
  });
}

module.exports = { registerRoutes };
