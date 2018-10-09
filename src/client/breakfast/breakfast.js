'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import xr from 'xr';
import { Provider } from 'react-redux';

import Store from './store';
import { windowResize } from './actions/background';
import { logosLoaded } from './actions/logo';
import { fontsLoaded } from './actions/font';
import { teamsLoaded } from './actions/sports';
import App from './containers/app';

export default function Breakfast() {
  // TODO
  xr.get('/logos/getLogos/')
    .then((data) => {
      Store.dispatch(logosLoaded(data));
    });

  // TODO
  xr.get('/fonts/getFonts/')
    .then((data) => {
      Store.dispatch(fontsLoaded(data.fonts));
    });

  xr.get('/sports/teams/')
    .then((data) => {
      Store.dispatch(teamsLoaded(data));
    });

  window.addEventListener('resize', () => {
    Store.dispatch(windowResize());
  });

  ReactDOM.render(
    <Provider store={Store}>
      <App />
    </Provider>,
    document.getElementById('editor')
  );
}
