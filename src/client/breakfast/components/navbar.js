'use strict';

import React, { Component, PropTypes } from 'react';

export default class NavBar extends Component {
  static propTypes = {
    email: PropTypes.string,
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

    return (
      <div className="user-dropdown-container">
        <div style={coverStyle} onClick={this.toggleDropdown}></div>
        <div className="user-dropdown">
          <div className="user-links">
            <a href="mailto:help@breakfast.im">Feedback</a>
            <a href="/logout/">Log Out</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { email } = this.props;

    return (
      <div id="navbar">
        <div className="links-container">
          <a className="title" href="/">Breakfast</a>
          <div className="links">
            <a href="/">Home</a>
            <a href="/gallery/">Gallery</a>
          </div>
        </div>
        <div className="user-container">
          <div className="email">{email}</div>
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
