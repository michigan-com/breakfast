'use strict';

import { combineReducers } from 'redux';

import Attribution from './attribution';
import Background from './background';
import Font from './font';
import Logo from './logo';
import Text from './text';

export default combineReducers({ Attribution, Background, Font, Logo, Text });
