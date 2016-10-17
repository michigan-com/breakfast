
import React from 'react';
import { Link } from 'react-router';

export default function App(props) {
  let nav = null;
  if (window.location.pathname !== '/admin/' && window.location.pathname !== '/admin') {
    nav = (
      <div className="admin-nav">
        <Link to={'/admin/'}><i className="fa fa-chevron-left"></i> Back</Link>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {nav}
      {props.children}
    </div>
  );
}

// export default connect()(App);
