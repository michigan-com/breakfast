
import React, { PropTypes } from 'react';
import { render } from 'react-dom';

import App from './containers/app';

export default function Admin() {
  render(
    <App />,
    document.getElementById('admin')
  );
}
