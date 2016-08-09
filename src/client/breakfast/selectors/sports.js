'use strict';

import { createSelector } from 'reselect';

const sportsSelector = (state) => state.Sports.present;

export const filteredTeamsSelector = createSelector(
  sportsSelector,
  (Sports) => {
    const { teams, filter } = Sports;
    const lowerFilter = filter.toLowerCase();
    if (filter === '') return teams;

    const filteredTeams = [];
    for (const team of teams) {
      if (team.searchTerm.toLowerCase().indexOf(lowerFilter) >= 0) filteredTeams.push(team);
    }

    return filteredTeams.sort((a, b) => (b.searchTerm - a.searchTerm));
  }
);
