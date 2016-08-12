'use strict';

import React from 'react';
import xr from 'xr';

import Store from './store';
import { DEFAULT_STATE, usernameUpdate, inputError, sendingEmail, doneSendingEmail,
  } from './actions/input';
import marketInfo from '../../../marketInfo';
import { Select } from '../util/components';

const validEmailDomains = [];
Object.values(marketInfo)
  .filter((market) => (market.domain !== 'gannett.com' && /\.\w{3}$/.test(market.domain)))
  .forEach((market) => { validEmailDomains.push(market.domain); });
validEmailDomains.sort();

class DomainSelect extends Select {
  getDisplayValue(option) { return `@${option}`; }
}

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailDomain: '',
      emailDomainIndex: 0,
    };

    this.csrfToken = document.getElementById('_csrf').value;
    this.submitForm = this.submitForm.bind(this);
    this.usernameChange = this.usernameChange.bind(this);
    this.emailDomainUpdate = this.emailDomainUpdate.bind(this);
    this.domainSelect = null;
  }

  getFullEmail() {
    if (this.domainSelect === null) return '';
    const username = this.props.Input.username;
    const domain = this.state.emailDomain;
    const email = `${username}@${domain}`;
    return email;
  }

  emailDomainUpdate(domain, index) {
    this.setState({ emailDomain: domain, emailDomainIndex: index });
  }

  usernameChange(e) {
    e.preventDefault();
    e.stopPropagation();

    const newValue = e.target.value.replace(/ /g, '');

    if (/@/.test(newValue)) {
      Store.dispatch(
        inputError('Please only input your username, the part before the @ symbol')
      );

      if (/@/.test(this.props.Input.username)) return;
    } else {
      Store.dispatch(inputError(''));
    }

    Store.dispatch(usernameUpdate(newValue));
  }

  submitForm(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.Input.inputError) return;
    else if (this.props.Input.username === '') {
      Store.dispatch(inputError('Please input your username'));
      return;
    }

    const email = this.getFullEmail();
    const _csrf = this.csrf;
    const values = { email, _csrf };
    Store.dispatch(sendingEmail());
    xr.post('/register/', values)
      .then(() => {
        Store.dispatch(doneSendingEmail());
      }, (err) => {
        const resp = JSON.parse(err.response);
        Store.dispatch(inputError(resp.error));
      });
    //   let username = $('.form-field.username input').val();
    //   let selectedIndex = $('#domains')[0].selectedIndex;
    //   let domain = domainSelect.currentSelection();
    //   let email = `${username}@${domain}`;
  }

  render() {
    const inputErrorClass = ['input', 'username', 'form-field'];
    let submitDisabled = false;
    let submitValue = 'Submit';
    if (this.props.Input.inputError) {
      inputErrorClass.push('error');
      submitDisabled = true;
    } else if (this.props.Input.emailSent) {
      inputErrorClass.push('success');
      submitDisabled = true;
      submitValue = '✓';
    } else if (this.props.Input.username === '') {
      submitDisabled = true;
    }

    return (
      <div className="form-container">
        <form
          className="register-form"
          action="/register/"
          method="POST"
          onSubmit={this.submitForm}
        >
          <div className={inputErrorClass.join(' ')}>
            <div className="input-feedback error">{this.props.Input.inputError}</div>
            <div className="input-feedback feedback">{this.props.Input.inputFeedback}</div>
            <input
              type="text"
              name="username"
              value={this.props.Input.username}
              ref={(input) => { if (input) input.focus(); }}
              onChange={this.usernameChange}
              placeholder="username"
            />
          </div>
          <div id="domains">
            <DomainSelect
              ref={(select) => { if (select) this.domainSelect = select; }}
              onSelect={this.emailDomainUpdate}
              currentIndex={this.state.emailDomainIndex}
              options={validEmailDomains}
            />
          </div>
          <div className="submit">
            <input type="submit" value={submitValue} id="submit" disabled={submitDisabled} />
            <div className="full-email">{this.getFullEmail()}</div>
          </div>
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  Input: React.PropTypes.shape(DEFAULT_STATE).isRequired,
};
