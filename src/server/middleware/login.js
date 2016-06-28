'use strict';

function loginRequired(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You need to login to see this page');
    res.redirect('/login/');
  } else {
    res.locals.user = req.user;
    next();
  }
}

module.exports = {
  loginRequired,
};
