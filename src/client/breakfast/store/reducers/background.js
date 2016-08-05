'use strict';

import undoable from 'redux-undo';

import { BACKGROUND_COLOR_CHANGE, BACKGROUND_IMAGE_CHANGE,
  REMOVE_BACKGROUND_IMAGE, DEFAULT_BACKGROUND_IMAGE, DEFAULT_STATE,
  BACKGROUND_DRAW_LOCATION_CHANGE, ASPECT_RATIO_CHANGE, FIT_IMAGE, ASPECT_RATIOS,
  DEFAULT_BACKGROUND_OFFSET, getAspectRatioValue } from '../../actions/background';

function backgroundReducer(state = DEFAULT_STATE, action) {
  let { backgroundColor, aspectRatioIndex, backgroundOffset } = state;
  let newState = null;
  const { aspectRatioOptions } = state;
  const newAspectRatioOptions = [];
  const currentAspectRatio = aspectRatioOptions[aspectRatioIndex];
  switch (action.type) {
    case BACKGROUND_COLOR_CHANGE:
      backgroundColor = action.value;
      return { ...state, backgroundColor };
    case BACKGROUND_IMAGE_CHANGE:
      newState = { backgroundImg: action.value };
      for (const ratio of aspectRatioOptions) {
        if (ratio.name === FIT_IMAGE) {
          ratio.value = getAspectRatioValue(newState, FIT_IMAGE);
        }
        newAspectRatioOptions.push(ratio);
      }

      return { ...state,
        ...newState,
        aspectRatioOptions: newAspectRatioOptions,
        backgroundOffset: { ...DEFAULT_BACKGROUND_OFFSET },
      };
    case REMOVE_BACKGROUND_IMAGE:
      // TODO remove attribution
      if (currentAspectRatio.name === FIT_IMAGE) {
        aspectRatioIndex = 0;
      }
      return { ...state,
        backgroundImg: { ...DEFAULT_BACKGROUND_IMAGE },
        aspectRatioIndex,
      };
    case ASPECT_RATIO_CHANGE:
      aspectRatioIndex = action.value;
      if (aspectRatioIndex >= 0 && aspectRatioIndex < ASPECT_RATIOS.length) {
        return { ...state,
          aspectRatioIndex,
        };
      }
      break;
    case BACKGROUND_DRAW_LOCATION_CHANGE:
      backgroundOffset = {
        dx: action.value.dx,
        dy: action.value.dy,
      };
      return { ...state, backgroundOffset };
    default:
      return { ...state };
  }
  return { ...state };
}

export default undoable(backgroundReducer);
