'use strict';

import { SHOW_REPOSITIONING, HIDE_REPOSITIONING, DEFAULT_STATE } from '../../actions/nav';


export default function nav(state = DEFAULT_STATE, action) {
  let { showRepositioning } = state;
  switch (action.type) {
    case SHOW_REPOSITIONING:
      showRepositioning = true;
      return { ...state, showRepositioning };
    case HIDE_REPOSITIONING:
      showRepositioning = false;
      return { ...state, showRepositioning };
    default:
      return { ...state };
  }
}
