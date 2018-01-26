'use strict';

import { DEFAULT_STATE } from '../../actions/templates';

export default function templatesReducer(state = DEFAULT_STATE, action) {
  let { templates } = state;
  switch (action.type) {
    default:
      return { ... state };
  }
}
