'use strict';

import AWS from 'aws-sdk';
import debug from 'debug';
import assign from 'object-assign';

import uuid from '../util/uuid';
import { loginRequired } from '../middleware/login';

var logger = debug('breakfast:aws');
var breakfastBucket = 'michigan-breakfast';
var s3 = new AWS.S3();


// TODO remove
var CACHE = undefined;

function listObjects(opts={}) {
  return new Promise(function(resolve, reject) {
    let awsOpts = assign({}, opts, { Bucket: breakfastBucket });

    s3.listObjects(awsOpts, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}

/**
 * Register the routes for LogoFetch. Registers URLs for getting
 * default logos, and for URLs to color the logos
 *
 * @param {Object} app - Express object. Use to get DB connection as needed
 * @param {Object} router - express.Router() instance
 * @param {Object} passport - Passport instance
 */
function registerRoutes(app, router, passport) {
  let db = app.get('db');
  let Photo = db.collection('Photo');

  router.get('/get-all-images/', async (req, res, next) => {
    let photos = [];
    try {
      //let objects = await listObjects({ MaxKeys: 100 });
      if (!CACHE) {
        let objects = await listObjects();
        photos = objects.Contents;
        CACHE = photos;
      } else {
        photos = CACHE;
      }

      for (let photo of photos) {
        photo.url = `https://michigan-breakfast.s3.amazonaws.com/${photo.Key}`;
      }
    } catch(e) {
      logger(e);
    }

    res.json({ photos });
  });

  router.put('/save-image/', loginRequired, (req, res, next) => {
    if (!('imageData' in req.body)) {
      res.status(400);
      return next();
    }

    // Don't upload unless on prod
    if (process.env.NODE_END != 'production') {
      res.status(200);
      res.sent();
      return;
    }

    let imageData = req.body.imageData.replace(/^data:image\/png;base64,/, '')
    let filename = `${uuid()}.png`;

    s3.upload({
      Bucket: breakfastBucket,
      Key: filename,
      Body: new Buffer(imageData, 'base64'),
      ContentType: 'image/png'
    }, async (err, data) => {
      if (err) {
        logger(`ERR: ${err}`)
        res.status(500);
        res.send(err);
        return;
      } else {
        logger(`Saved ${filename}`)

        let photoObj = await Photo.insertOne({
          email: req.user.email,
          photo: filename
        });

        res.status(200);
        res.send();
        return;
      }
    });
  });
}

module.exports = { registerRoutes }

