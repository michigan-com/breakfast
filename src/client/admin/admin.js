
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import xr from 'xr';

import App from './containers/app';
import Index from './components/indexRoute';
import PhotoAdmin from './containers/photos';
import UsersAdmin from './containers/users';
import Store from './store';
import { photosLoaded } from './actions/photos';

const history = syncHistoryWithStore(browserHistory, Store);

export default function Admin() {
  xr.get('/admin/photos/all')
    .then((resp) => {
      Store.dispatch(photosLoaded(resp.data.photos));
    });

  render(
    <Provider store={Store}>
      <Router history={history}>
        <Route path="/admin" component={App} >
          <IndexRoute component={Index} />
          <Route path="photos" component={PhotoAdmin} />
          <Route path="users" component={UsersAdmin} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('admin')
  );
}
