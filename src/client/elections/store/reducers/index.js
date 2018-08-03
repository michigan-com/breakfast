
'use strict';

import { combineReducers } from 'redux';

import Font from '../../../breakfast/store/reducers/font';
import Logo from '../../../breakfast/store/reducers/logo';
import Downloading from '../../../breakfast/store/reducers/downloading';
import Nav from '../../../breakfast/store/reducers/nav';
import Uploads from '../../../breakfast/store/reducers/uploads';
import Attribution from '../../../breakfast/store/reducers/attribution';
import OptionsMenu from './options-menu';
// import Background from './background';
import Templates from './templates';
import Candidates from './candidates';

export default combineReducers({
  Logo,
  Font,
  OptionsMenu,
  // Background,
  Downloading,
  Nav,
  Attribution,
  Uploads,
  Templates,
  Candidates,
});
