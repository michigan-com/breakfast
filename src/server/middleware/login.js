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

function adminRequired(req, res, next) {
  if (!req.user || !req.user.admin) {
    req.flash('error', 'Access denied');
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = {
  loginRequired,
  adminRequired,
};
