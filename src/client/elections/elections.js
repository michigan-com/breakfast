'use strict';

import React from 'react';
import { render } from 'react-dom';
import xr from 'xr';
import { Provider } from 'react-redux';

import Store from './store';
import { windowResize } from '../breakfast/actions/background';
import { logosLoaded } from '../breakfast/actions/logo';
import { fontsLoaded } from '../breakfast/actions/font'
import App from './containers/app';

export default function Elections() {
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

  window.addEventListener('resize', () => {
    Store.dispatch(windowResize());
  });

  render(
    <Provider store={Store}>
      <App />
    </Provider>,
    document.getElementById('editor')
  );
}
