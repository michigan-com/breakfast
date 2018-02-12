'use strict';

function loginRequired(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You need to login to see this page');
    res.redirect('/');
  } else {
    res.locals.user = req.user;
    next();
  }
}

function adminRequired(req, res, next) {
  const adminEmails = {
    'mvarano@michigan.com': true,
    'rewilliams@gannett.com': true,
    'cclements@gannett.com': true,
  };
  if (!req.user || !(req.user.emailAddress in adminEmails)) {
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
