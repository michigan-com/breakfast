import xr from 'xr';
import React from 'react';

import $ from './util/$';
import { Select } from './util/components';
import { validEmailDomains } from '../server/util/email';

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
    $('.form-field.username').removeClass('error').addClass('error');
    $('.form-field.username .errors').html('<p>Please specify a username</p>');
    return;
  }

  xr.post('/register/', values).then(function(resp) {
    window.location = `/register/email-sent/${email}/`;
  }, function(resp) {
    let response = JSON.parse(resp.response);

    for (var error in response.error) {
      let errorString = response.error[error];

      if (error === 'email') {
        error = 'username';
      }

      $(`.form-field.${error}`).removeClass('error').addClass('error');
      $(`.form-field.${error} .errors`).html(`<p>${errorString}</p>`);
    }
  });
});


