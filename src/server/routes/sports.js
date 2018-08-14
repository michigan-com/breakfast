'use strict';

import { Router } from 'express';

import mlb from '../../data/sports/mlb.json';
import nba from '../../data/sports/nba.json';
import nfl from '../../data/sports/nfl.json';
import nhl from '../../data/sports/nhl.json';
import ncaab from '../../data/sports/ncaab.json';
import ncaaf from '../../data/sports/ncaaf.json';
import mls from '../../data/sports/mls.json';
import wnba from '../../data/sports/wnba.json';

function addRequestedChanges(sport) {
  const teams = [];
  for (const group of sport.groups) {
    for (const team of group.teams) {
      if (team.team_long === 'UL Lafayette Ragin\' Cajuns') {
        team.team_abbr = 'UL';
      }
    }
  }
  return sport;
}

function registerRoutes(app) {
  const router = new Router();

  // TODO hit api/database for teams
  router.get('/sports/teams/', (req, res) => {
    res.json({
      mlb,
      nba,
      nfl,
      nhl,
      ncaab: addRequestedChanges(ncaab),
      ncaaf: addRequestedChanges(ncaaf),
      mls,
      wnba,
    });
  });

  app.use('/', router);
}

module.exports = { registerRoutes };
