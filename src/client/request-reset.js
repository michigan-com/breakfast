'use strict';

import xr from 'xr';

import $ from './util/$';

$('form.password-reset-form').on('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const email = $('.form-field.email input').val();
  const values = { email };

  xr.post('/password-reset/', values).then(() => {
    document.getElementById('success-text')
      .innerText = 'Please check your email for the password reset link';
    const submit = document.getElementById('submit');

    submit.setAttribute('disabled', true);
    submit.value = '✓';
  }, (resp) => {
    const response = JSON.parse(resp.response);

    let errorString = '';
    Object.values(response.error).forEach((error) => {
      errorString = response.error[error];
    });
    document.getElementById('success-text').innerText = errorString;
  });
});
