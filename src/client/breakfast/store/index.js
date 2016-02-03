'use strict';

import assign from 'object-assign';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { DEFAULT_STORE } from '../actions';
import * as reducers from './reducers';

const Reducers = combineReducers(reducers);

export default createStore(Reducers, applyMiddleware(thunkMiddleware));//, DEFAULT_STORE);