'use strict';

import debug from 'debug';

var logger = debug('breakfast:loginRequired');

function loginRequired(req, res, next) {
  logger(req.originalUrl);
  //logger(req);
  logger(req.user);
  if (!req.user) {
    req.flash('error', 'You need to login to see this page');
    res.redirect('/login/');
  } else {
    next();
  }
}

module.exports = {
  loginRequired
}
