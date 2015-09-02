import { Router } from 'express';
import logoFetch from './logoFetch';
import login from './login';

let router = new Router();

// Create the different routes
logoFetch.registerRoutes(router);
login.registerRoutes(router);

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/breakfast/', function(req, res) {
  res.render('breakfast');
});


module.exports = router
