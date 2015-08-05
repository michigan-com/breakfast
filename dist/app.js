'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var app = (0, _express2['default'])();
var BASE_DIR = _path2['default'].dirname(__dirname);

app.set('views', _path2['default'].join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use((0, _serveFavicon2['default'])(_path2['default'].join(BASE_DIR, '/public/favicon.ico')));
app.use(_bodyParser2['default'].json());
app.use(_bodyParser2['default'].urlencoded({ extended: false }));
app.use((0, _cookieParser2['default'])());
app.use(_express2['default']['static'](_path2['default'].join(BASE_DIR, 'public')));

app.get('/', function (req, res) {
  res.render('index');
});

module.exports = app;