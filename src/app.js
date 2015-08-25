'use strict';

import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import LogoFetch from './logoFetch.js';
let logoFetch = new LogoFetch();

var app = express();
var BASE_DIR = path.dirname(__dirname);

app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'public')));

app.get('/', function(req, res) {
  res.render('index')
});

app.get('/logos/:color/:filename', handleGetLogo);
app.get('/logos/:filename', handleGetLogo);

function handleGetLogo(req, res, next) {
  return getLogo(req, res, next).catch(function(err) {
    next(err);
  });
}

async function getLogo(req, res, next) {
  let color = 'color' in req.params ? req.params.color : undefined;
  let filename = req.params.filename;

  let data = await logoFetch.getLogo(filename, color);

  let buffer = new Buffer(data, 'utf8');

  res.set({
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=0',
    'Content-Type': 'image/svg+xml',
    'Content-Length': buffer.length
  }).send(buffer);
}

app.get('/test/route.svg', function(req, res, next) {
  res.send('testing');
});

module.exports = app;
