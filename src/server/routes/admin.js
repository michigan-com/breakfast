
import { Router } from 'express';

import { adminRequired } from '../middleware/login';


function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => { next(err); });
  };
}

function registerRoutes(app) {
  const router = new Router();
  const db = app.get('db');
  const User = db.collection('User');
  const Photo = db.collection('Photo');

  router.get('/', adminRequired, (req, res) => {
    res.render('admin');
  });

  router.get('/users/all/', adminRequired, catchAsync(async (req, res) => {
    const users = await User.find({}, { email: true, admin: true }).toArray();
    res.json({ data: { users } });
  }));

  router.get('/users/admin/', adminRequired, catchAsync(async (req, res) => {
    const users = await User.find({ admin: true }, { email: true, admin: true }).toArray();
    res.json({ data: { users } });
  }));

  router.post('/users/make-admin/', adminRequired, catchAsync(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const user = await User.find({ email }).limit(1).next();
    if (!user) res.status(422).json({ error: 'user ${email} not found' });

    await User.update({ email }, { $set: { admin: true } });
    return res.json({ data: 'Success' });
  }));

  router.post('/users/remove-admin/', adminRequired, catchAsync(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const user = await User.find({ email }).limit(1).next();
    if (!user) res.status(422).json({ error: 'user ${email} not found' });

    await User.update({ email }, { $set: { admin: false } });
    return res.json({ data: 'Success' });
  }));

  router.get('/photos/all/', adminRequired, catchAsync(async (req, res) => {
    const photos = await Photo.find({}).toArray();
    res.json({ data: { photos } });
  }));

  app.use('/admin', router);
}

module.exports = { registerRoutes };
