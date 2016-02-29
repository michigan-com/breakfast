'use strict';

import xr from 'xr';
import React from 'react';

import $ from './util/$';
import { Select } from './util/components';
import marketInfo from '../../marketInfo';

let validEmailDomains = [];
for (let marketName in marketInfo) {
  let market = marketInfo[marketName];
  if (market.domain === 'gannett.com' || !/\.\w{3}$/.test(market.domain)) continue;
  validEmailDomains.push(market.domain);
}

validEmailDomains = validEmailDomains.sort();

class DomainSelect extends Select {
  getDisplayValue(option, index) { return `@${option}`; }
}

let domainSelect = React.render(
  <DomainSelect options={ validEmailDomains } />,
  document.getElementById('domains')
)


// Hotwire the form sending
$('form.register-form').on('submit', function(e) {

  e.preventDefault();
  e.stopPropagation();

  // Get the values from the form input
  let _csrf = $('.form-field._csrf input').val();
  let username = $('.form-field.username input').val();
  let selectedIndex = $('#domains')[0].selectedIndex;
  let domain = domainSelect.currentSelection();
  let email = `${username}@${domain}`;
  let values = {
    _csrf,
    email
  };

  if (!username) {
    return;
  }

  xr.post('/register/', values).then(function(resp) {
    document.getElementById('success-text').innerText = `Please check your email for confirmation.`;
    let submit = document.getElementById('submit')

    submit.setAttribute('disabled', true);
    submit.value = '✓';

  }, function(resp) {
    let response = JSON.parse(resp.response);

    for (var error in response.error) {
      let errorString = response.error[error];

      if (error === 'email') {
        error = 'username';
      }

      document.getElementById('success-text').innerText = errorString;
    }
  });
});


