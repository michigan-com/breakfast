'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import xr from 'xr';
import { Provider } from 'react-redux';

import Store from './store';
import { logosLoaded } from './actions/logo';
import { fontsLoaded } from './actions/font';
import PicEditor from './containers/pic-editor';
import OptionsMenu from './containers/options-menu';

function App(props) {
  return (
    <div>
      <OptionsMenu />
      <PicEditor />
    </div>
  );
}

function renderBreakfast() {
  ReactDOM.render(
    <Provider store={Store}>
      <App />
    </Provider>,
    document.getElementById('editor')
  );
}

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

  Store.subscribe(renderBreakfast);
  renderBreakfast();
}
