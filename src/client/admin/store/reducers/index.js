
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Photos from './photos';

export default combineReducers({
  Photos,
  routing: routerReducer,
});
