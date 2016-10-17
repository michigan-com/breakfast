
import { Router } from 'express';

import { adminRequired } from '../middleware/login';

const DEFAULT_LIMIT = 10;

function catchAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => { next(err); });
  };
}

/**
 * Take URL params sent by the DataTable component (src/client/admin/components/data-table)
 * and
 */
function parseTableQueryParams(req, res, next) {
  console.log(req.query);
  next();
}

function registerRoutes(app) {
  const router = new Router();
  const db = app.get('db');
  const User = db.collection('User');
  const Photo = db.collection('Photo');

  router.get('/', adminRequired, (req, res) => {
    res.render('admin');
  });

  router.get('/photos/', adminRequired, (req, res) => {
    res.render('admin');
  });

  router.get('/users/', adminRequired, (req, res) => {
    res.render('admin');
  });

  /* Data Fetching functions */
  router.get('/user/', adminRequired, catchAsync(async (req, res) => {
    const { email } = req.query;

    const users = await User.find({
      email: new RegExp(email.toLowerCase()),
    }, { email: true, admin: true })
      .limit(10)
      .toArray();

    res.json({ users });
  }));

  router.get('/users/all/', adminRequired, catchAsync(async (req, res) => {
    const { pageSize, page, sortCol, sortDir, filter } = req.query;
    const limit = parseInt(pageSize, 10);
    const pageOffset = (page - 1) * pageSize;
    const sortVals = {};
    sortVals[sortCol] = sortDir === 'asc' ? -1 : 1;

    const filterValues = {};
    if (filter) filterValues.email = new RegExp(filter.toLowerCase());

    const users = await User.find(filterValues, { email: true, admin: true })
      .sort(sortVals)
      .skip(pageOffset)
      .limit(isNaN(limit) ? DEFAULT_LIMIT : 10)
      .toArray();

    const totalCount = await User.count(filterValues);
    res.json({
      data: {
        users,
        totalCount,
      },
    });
  }));

  router.get('/users/admin/', adminRequired, catchAsync(async (req, res) => {
    const { pageSize, page, sortCol, sortDir } = req.query;
    const limit = parseInt(pageSize, 10);
    const pageOffset = (page - 1) * pageSize;
    const sortVals = {};
    sortVals[sortCol] = sortDir === 'asc' ? 1 : -1;

    const users = await User.find({ admin: true }, { email: true, admin: true })
      .sort(sortVals)
      .skip(pageOffset)
      .toArray();
    const totalCount = await User.count({ admin: true });
    res.json({
      data: {
        users,
        totalCount,
      },
    });
  }));

  router.get('/photos/all/', adminRequired, catchAsync(async (req, res) => {
    const { pageSize, page, sortCol, sortDir } = req.query;
    const limit = parseInt(pageSize, 10);
    const pageOffset = (page - 1) * pageSize;
    const sortVals = {};
    sortVals[sortCol] = sortDir === 'asc' ? 1 : -1;

    const photos = await Photo.find().toArray();
    const totalCount = await Photo.count();
    res.json({
      data: {
        photos,
        totalCount,
      },
    });
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

  app.use('/admin', router);
}

module.exports = { registerRoutes };
