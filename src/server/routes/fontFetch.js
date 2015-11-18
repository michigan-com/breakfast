
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
function registerRoutes(app, router, passport) {
  router.get('/fonts/getFonts/', loginRequired, (req, res, next) => {
    let domain = getDomainFromEmail(req.user.email);
    let fonts = basicFonts.slice(); // copies the array

    if (domain === 'usatoday.com') fonts = fonts.concat(usatFonts);
    res.json({ fonts });
  });
}

module.exports = { registerRoutes }
