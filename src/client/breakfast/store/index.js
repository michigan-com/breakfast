'use strict';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import Reducers from './reducers';

export default createStore(Reducers, applyMiddleware(thunkMiddleware));// , DEFAULT_STORE);
