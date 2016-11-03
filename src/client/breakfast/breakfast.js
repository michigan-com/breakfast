'use strict';

import React from 'react';
import { render } from 'react-dom';
import xr from 'xr';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Store from './store';
import { windowResize } from './actions/background';
import { logosLoaded } from './actions/logo';
import { fontsLoaded } from './actions/font';
import { teamsLoaded } from './actions/sports';
import { userDataLoaded } from './actions/user';
import App from './containers/app';
import Profile from './containers/profile';
import PhotoEditor from './containers/photo-editor';

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
  xr.get('/profile/data/')
    .then((data) => {
      Store.dispatch(userDataLoaded(data));
    });

  window.addEventListener('resize', () => {
    Store.dispatch(windowResize());
  });

  const history = syncHistoryWithStore(browserHistory, Store);

  render(
    <Provider store={Store}>
      <Router history={history}>
        <Route path="/breakfast" component={App}>
          <IndexRoute component={PhotoEditor} />
          <Route path="profile" component={Profile} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('editor')
  );
}
