'use strict';

export const TOGGLE_SPORTS = 'TOGGLE_SPORTS';
export const TEAMS_LOADED = 'TEAMS_LOADED';
export const FILTER_TEAMS = 'FILTER_TEAMS';
export const SELECT_TEAM = 'SELECT_TEAM';
export const MANUAL_TEAM_INPUT = 'MANUAL_TEAM_INPUT';
export const SCORE_CHANGE = 'SCORE_CHANGE';
export const TIME_CHANGE = 'TIME_CHANGE';
export const POSITION_CHANGE = 'POSITION_CHANGE';

export const TOP = 'top';
export const BOTTOM = 'bottom';
export const LEFT = 'left';
export const RIGHT = 'right';

export const DEFAULT_TEAM = {
  teamName: '',
  teamAbbr: '',
  logo: null,
  logoUrl: '',
};

const DEFAULT_SCORE_DATA = {
  teams: [{
    ...DEFAULT_TEAM,
  }, {
    ...DEFAULT_TEAM,
  }],
  teamScores: ['', ''],
  time: '',
};

export function toggleSportsScore(show = false) {
  return {
    type: TOGGLE_SPORTS,
    value: show,
  };
}

export function teamsLoaded(teamData) {
  const teams = [];

  Object.keys(teamData).forEach((league) => {
    for (const team of teamData[league].teams) {
      const searchTerm = `${team.team_first} ${team.team_last}`;

      teams.push({
        ...team,
        league,
        searchTerm,
      });
    }
  });

  return {
    type: TEAMS_LOADED,
    value: teams,
  };
}

export function filterTeams(filter = '', filterTeamIndex = 0) {
  return {
    type: FILTER_TEAMS,
    value: {
      filter,
      filterTeamIndex,
    },
  };
}

function loadTeam(team = DEFAULT_TEAM, filterTeamIndex = 0) {
  return {
    type: SELECT_TEAM,
    value: {
      team,
      filterTeamIndex,
    },
  };
}

export function selectTeam(team = DEFAULT_TEAM, filterTeamIndex = 0) {
  return (dispatch) => {
    dispatch(loadTeam(team, filterTeamIndex));

    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.addEventListener('load', () => {
      const newTeam = { ...team };
      newTeam.logo = i;
      dispatch(loadTeam(newTeam, filterTeamIndex));
    });
    i.src = team.logoUrl;
  };
}

export function manualTeamInput(filterTeamIndex) {
  return {
    type: MANUAL_TEAM_INPUT,
    value: { filterTeamIndex },
  };
}

export function scoreChange(score = -1, filterTeamIndex = 0) {
  return {
    type: SCORE_CHANGE,
    value: {
      score,
      filterTeamIndex,
    },
  };
}

export function timeChange(time = '') {
  return {
    type: TIME_CHANGE,
    value: time,
  };
}

export function scorePositionChange(index) {
  return {
    type: POSITION_CHANGE,
    value: index,
  };
}

export const DEFAULT_STATE = {
  showSports: true,
  teams: [],
  filter: '',
  filterTeamIndex: 0, // Which team is being filterd
  scoreData: { ...DEFAULT_SCORE_DATA },
  positionOptions: [TOP, BOTTOM, LEFT, RIGHT],
  currentPositionIndex: 0,
};
