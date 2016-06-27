'use strict';

import xr from 'xr';

import $ from './util/$';

$('form.password-reset-form').on('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  let email = $('.form-field.email input').val();
  let values = { email };

  xr.post('/password-reset/', values).then((resp) => {
    document.getElementById('success-text').innerText = 'Please check your email for the password reset link';
    let submit = document.getElementById('submit');

    submit.setAttribute('disabled', true);
    submit.value = '✓';
  }, (resp) => {
    let response = JSON.parse(resp.response);

    for (var error in response.error) {
      let errorString = response.error[error];
      document.getElementById('success-text').innerText = errorString;
    }
  });
});
