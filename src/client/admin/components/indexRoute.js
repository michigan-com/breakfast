
import React from 'react';
import { Link } from 'react-router';

export default function IndexRoute() {
  return (
    <div className="admin-options">

      <h1>Breakfast Admin</h1>
      <div className="admin-options-container">
        <div className="option-container">
          <Link to="/admin/photos/" className="option">
            <i className="fa fa-picture-o"></i>
            <h3>Pictures</h3>
          </Link>
        </div>
        <div className="option-container">
          <Link to="/admin/users" className="option">
            <i className="fa fa-user"></i>
            <h3>Users</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
