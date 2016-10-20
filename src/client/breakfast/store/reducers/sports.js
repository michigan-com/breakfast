'use strict';

import undoable, { excludeAction } from 'redux-undo';

import { TOGGLE_SPORTS, TEAMS_LOADED, FILTER_TEAMS, SELECT_TEAM, DEFAULT_TEAM,
  SCORE_CHANGE, TIME_CHANGE, POSITION_CHANGE, MANUAL_TEAM_INPUT, DEFAULT_STATE,
  } from '../../actions/sports';

function filterIndexReducer(state, action) {
  let { filter, filterTeamIndex } = state;
  const scoreData = { ...state.scoreData };
  filterTeamIndex = action.value.filterTeamIndex;

  for (let i = 0; i < scoreData.teams.length; i++) {
    if (i === filterTeamIndex) {
      switch (action.type) {
        case FILTER_TEAMS:
          filter = action.value.filter;
          scoreData.teams[i] = { ...DEFAULT_TEAM };
          break;
        case SELECT_TEAM:
          filter = '';
          scoreData.teams[i] = action.value.team;
          break;
        case MANUAL_TEAM_INPUT:
          scoreData.teams[i] = {
            ...DEFAULT_TEAM,
            teamName: filter,
          };
          filter = '';
          break;
        case SCORE_CHANGE:
          scoreData.teamScores[i] = action.value.score;
          break;
        default:
          continue;
      }
    }
  }

  return {
    ...state,
    filterTeamIndex,
    filter,
    scoreData,
  };
}

function sports(state = DEFAULT_STATE, action) {
  let { teams, showSports, currentPositionIndex } = state;
  const scoreData = { ...state.scoreData };
  switch (action.type) {
    case FILTER_TEAMS:
    case SELECT_TEAM:
    case SCORE_CHANGE:
    case MANUAL_TEAM_INPUT:
      return filterIndexReducer(state, action);
    case TOGGLE_SPORTS:
      showSports = action.value;
      return { ...state, showSports };
    case TEAMS_LOADED:
      teams = action.value;
      return { ...state, teams };
    case TIME_CHANGE:
      scoreData.time = action.value;
      return { ...state, scoreData };
    case POSITION_CHANGE:
      currentPositionIndex = action.value;
      return { ...state, currentPositionIndex };
    default:
      return { ...state };
  }
}

export default undoable(sports, {
  filter: excludeAction(TEAMS_LOADED),
});
