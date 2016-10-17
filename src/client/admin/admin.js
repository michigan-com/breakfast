
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/app';
import Index from './components/indexRoute';
import PhotoAdmin from './containers/photos';
import UsersAdmin from './containers/users';

export default function Admin() {
  render(
    <Router history={browserHistory}>
      <Route path="/admin" component={App} >
        <IndexRoute component={Index} />
        <Route path="photos" component={PhotoAdmin} />
        <Route path="users" component={UsersAdmin} />
      </Route>
    </Router>,
    document.getElementById('admin')
  );
}
