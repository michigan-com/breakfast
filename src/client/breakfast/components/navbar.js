'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class NavBar extends Component {
  static propTypes = {
    User: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      expandDropdown: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState({
      expandDropdown: !this.state.expandDropdown,
    });
  }

  renderUserDropdown() {
    if (!this.state.expandDropdown) return null;

    const coverStyle = {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    };

    const navLink = window.location.pathname.indexOf('/breakfast/profile') >= 0 ?
      <Link to="/breakfast/" onClick={this.toggleDropdown}>Photo Editor</Link> :
      <Link to="/breakfast/profile/" onClick={this.toggleDropdown}>Profile</Link>;


    return (
      <div className="user-dropdown-container">
        <div style={coverStyle} onClick={this.toggleDropdown}></div>
        <div className="user-dropdown">
          <div className="user-links">
            {navLink}
            <a href="mailto:help@breakfast.im">Help</a>
            <a href="/logout/">Log Out</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { user } = this.props.User;

    return (
      <div id="navbar">
        <div className="links-container">
          <Link className="title" to="/breakfast/">Breakfast</Link>
          <div className="links">
            <a href="/">Home</a>
            <a href="/gallery/">Gallery</a>
          </div>
        </div>
        <div className="user-container">
          <div className="email">{user ? user.email : ''}</div>
          <div className="user-dropdown-toggle-container">
            <div className="user-dropdown-toggle" onClick={this.toggleDropdown}>
              <img src="/img/profile.svg" alt="Profile" />
              <div className="down-arrow"></div>
            </div>
          </div>
          {this.renderUserDropdown()}
        </div>
      </div>
    );
  }
}
