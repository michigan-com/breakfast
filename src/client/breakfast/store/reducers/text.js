'use strict';

import { TEXT_WIDTH_CHANGE, TEXT_POS_CHANGE } from '../../actions/text';
import assign from 'object-assign';

export default function textReducer(state, action) {
  switch (action.type) {
    case textWidthChange:
      let width = action.value;
      if (!(width >= 0 && width <= 100)) return state;

      let maxTextWidth = state.canvas.canvasWidth - (state.canvas.canvasPadding * 2);
      let textWidth = maxTextWidth * (width / 100);
      return assign({}, state, { textWidth });
    case textPosChange:
      let textPos = action.value;
      return assign({}, state, { textPos });

    case default:
      return state;
  }
}
