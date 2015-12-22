'use strict';

import AWS from 'aws-sdk';
import debug from 'debug';

import uuid from '../util/uuid';
import { loginRequired } from '../middleware/login';

var logger = debug('breakfast:aws');
var breakfastBucket = 'michigan-breakfast';
var s3 = new AWS.S3();

function _listObjects() {
  return new Promise(function(resolve, reject) {
    s3.listObjects({ Bucket: breakfastBucket }, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}

async function listObjects() {
  let objects = await _listObjects({ Prefix: 'breakfast' });
  logger(objects);
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

  router.put('/save-image/', loginRequired, (req, res, next) => {
    if (!('imageData' in req.body)) {
      res.status(400);
      return next();
    }

    let imageData = req.body.imageData.replace(/^data:image\/png;base64,/, '')
    let filename = `${uuid()}.png`;

    s3.upload({
      Bucket: breakfastBucket,
      Key: filename,
      Body: new Buffer(imageData, 'base64')
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

