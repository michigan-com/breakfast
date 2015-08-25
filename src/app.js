'use strict';

import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Buffer from 'buffer';

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

app.get('/logos/:color/:filename', getLogo);
app.get('/logos/:filename', getLogo);

async function getLogo(req, res) {
  let color = 'color' in req.params ? req.params.color : undefined;
  let filename = req.params.filename;

  let data = await logoFetch.getLogo(filename, color);
  try {

    //let buffer = new Buffer(data, 'utf-8');
    //console.log(buffer.toString('hex'));

    res.set({
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Length': data.length,
    }).send(data);
  } catch(e) {

    console.error(e);
    res.send('Error');
  }
}

module.exports = app;
