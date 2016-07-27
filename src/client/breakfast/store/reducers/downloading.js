'use strict';

import { DEFAULT_STATE, START_DOWNLOADING, DONE_DOWNLOADING, UPDATE_FILENAME,
  } from '../../actions/downloading';

export default function downloadReducer(state = DEFAULT_STATE, action) {
  let { downloading, filename } = state;
  switch (action.type) {
    case START_DOWNLOADING:
      downloading = true;
      return { ...state, downloading };
    case DONE_DOWNLOADING:
      downloading = false;
      return { ...state, downloading };
    case UPDATE_FILENAME:
      filename = action.value;
      return { ...state, filename };
    default:
      return { ... state };
  }
}
