'use strict';

import AWS from 'aws-sdk';
import debug from 'debug';
import assign from 'object-assign';

import uuid from '../util/uuid';
import { loginRequired } from '../middleware/login';

const logger = debug('breakfast:aws');
const breakfastBucket = 'michigan-breakfast';
const s3 = new AWS.S3();

// TODO remove
let CACHE = undefined;
let CACHE_DATE = undefined;
const cacheLimit = 1000 * 60 * 60; // 1 hour

function cacheIsStale() {
  if (typeof CACHE_DATE === 'undefined') return true;

  const delta = (new Date()) - CACHE_DATE;
  return delta >= cacheLimit;
}

function listObjects(opts = {}) {
  return new Promise((resolve, reject) => {
    const awsOpts = assign({}, opts, { Bucket: breakfastBucket });

    s3.listObjects(awsOpts, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
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
function registerRoutes(app, router) {
  const db = app.get('db');
  const Photo = db.collection('Photo');

  router.get('/get-all-images/', async (req, res) => {
    let photos = [];
    try {
      // let objects = await listObjects({ MaxKeys: 100 });
      if ((typeof CACHE === 'undefined') || cacheIsStale()) {
        const objects = await listObjects();
        photos = objects.Contents;

        CACHE = photos;
        CACHE_DATE = new Date();
      } else {
        photos = CACHE;
      }

      for (const photo of photos) {
        photo.url = `https://michigan-breakfast.s3.amazonaws.com/${photo.Key}`;
      }
    } catch (e) {
      logger(e);
    }

    res.json({ photos });
  });

  router.put('/save-image/', loginRequired, async (req, res, next) => {
    if (!('imageData' in req.body)) {
      res.status(400);
      next();
      return;
    }
    const filename = `${uuid()}.png`;

    // Don't upload unless on prod
    if (process.env.NODE_ENV !== 'production') {
      await Photo.insertOne({
        email: req.user.emailAddress,
        photo: filename,
        createdAt: new Date(),
      });

      res.status(200);
      res.send();
      return;
    }

    const imageData = req.body.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    s3.upload({
      Bucket: breakfastBucket,
      Key: filename,
      Body: new Buffer(imageData, 'base64'),
      ContentType: 'image/png',
    }, async (err) => {
      if (err) {
        logger(`ERR: ${err}`);
        res.status(500);
        res.send(err);
      } else {
        logger(`Saved ${filename}`);

        await Photo.insertOne({
          email: req.user.emailAddress,
          photo: filename,
          createdAt: new Date(),
        });

        res.status(200);
        res.send();
      }
      return;
    });
  });
}

module.exports = { registerRoutes };
