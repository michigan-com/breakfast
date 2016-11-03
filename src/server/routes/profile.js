
import { Router } from 'express';

import { loginRequired } from '../middleware/login';
import catchAsync from '../middleware/catchAsync';

function registerRoutes(app) {
  const router = new Router();
  const db = app.get('db');
  const Photo = db.collection('Photo');

  router.get('/profile/data/', loginRequired, catchAsync(async (req, res) => {
    const user = req.user;
    const domain = /(.+)@(.+)/.exec(req.user.email)[2];
    let userPhotos = await Photo.find({ email: user.email }).toArray();
    const orgPhotoCount = await Photo.find({ email: new RegExp(domain) }).count();

    userPhotos = userPhotos.sort((a, b) => {
      if (!a.createdAt) return 1;
      else if (!b.createdAt) return -1;
      return b.createdAt - a.createdAt;
    });

    res.json({ user, userPhotos, orgPhotoCount });
  }));

  app.use('/', router);
}

module.exports = { registerRoutes };
