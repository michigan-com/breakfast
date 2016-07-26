'use strict';

import { DEFAULT_STATE, OPTION_SELECT, OPTION_DESELECT } from '../../actions/options-menu';

export default function optionsMenu(state = DEFAULT_STATE, action) {
  let { selectedIndex } = state;
  switch (action.type) {
    case OPTION_SELECT:
      selectedIndex = action.value;
      if (selectedIndex >= 0 && selectedIndex < state.options.length) {
        return { ...state, selectedIndex };
      }
      break;
    case OPTION_DESELECT:
      selectedIndex = -1;
      return { ...state, selectedIndex };
    default:
      return state;
  }
  return state;
}
