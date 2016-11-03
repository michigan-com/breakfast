'use strict';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Navbar from '../components/navbar';
import { getPresentState } from '../selectors/present';

function App({ children, User }) {
  return (
    <div>
      <Navbar User={User} />
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  User: PropTypes.object,
};


function mapStateToProps(state) {
  const { User } = getPresentState(state);
  return { User };
}
export default connect(mapStateToProps)(App);
