'use strict';

import { Router } from 'express';

import mlb from '../../data/sports/mlb.json';
import nba from '../../data/sports/nba.json';
import nfl from '../../data/sports/nfl.json';
import nhl from '../../data/sports/nhl.json';
import ncaab from '../../data/sports/ncaab.json';
import ncaaf from '../../data/sports/ncaaf.json';
import mls from '../../data/sports/mls.json';

function registerRoutes(app) {
  const router = new Router();

  // TODO hit api/database for teams
  router.get('/sports/teams/', (req, res) => {
    res.json({
      mlb,
      nba,
      nfl,
      nhl,
      ncaab,
      ncaaf,
      mls,
    });
  });

  app.use('/', router);
}

module.exports = { registerRoutes };
