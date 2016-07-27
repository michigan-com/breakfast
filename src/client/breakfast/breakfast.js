'use strict';

import React from 'react';
import { render } from 'react-dom';
import xr from 'xr';
import { Provider } from 'react-redux';

import Store from './store';
import { logosLoaded } from './actions/logo';
import { fontsLoaded } from './actions/font';
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

  render(
    <Provider store={Store}>
      <App />
    </Provider>,
    document.getElementById('editor')
  );
}
