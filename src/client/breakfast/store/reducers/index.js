'use strict';

import { combineReducers } from 'redux';

import Attribution from './attribution';
import Background from './background';
import Font from './font';
import Logo from './logo';
import Text from './text';
import OptionsMenu from './options-menu';
import Downloading from './downloading';
import Nav from './nav';
import Sports from './sports';

export default combineReducers({
  Attribution,
  Background,
  Font,
  Logo,
  Text,
  OptionsMenu,
  Downloading,
  Nav,
  Sports,
});
