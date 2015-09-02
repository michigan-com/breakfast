'use strict';

import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import passport from 'passport';

import router from './routes/router';

var app = express();
var BASE_DIR = path.dirname(__dirname);

app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'public')));
app.use(csrf({ cookie: true }));
app.use(passport.initialize());
app.use(passport.session());

// Register the routes
app.use('/', router);

module.exports = app;
