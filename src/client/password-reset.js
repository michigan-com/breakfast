'use strict';

import xr from 'xr';

import $ from './util/$';


$('form.password-reset-form').on('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const url = e.target.getAttribute('action');
  const password = $('.form-field.password input').val();
  const confirmPassword = $('.form-field.confirmPassword input').val();
  const _csrf = $('.form-field input').val();
  const values = { password, confirmPassword, _csrf };

  xr.post(url, values).then(() => {
    document.getElementById('success-text')
      .innerHTML = `
      <p>Password successfully changed</p>
      <p>Please <a href=\'/login/\'>Login</a> with your new password.
      `;
    const submit = document.getElementById('submit');

    submit.setAttribute('disabled', true);
    submit.value = '✓';
  }, (resp) => {
    const response = JSON.parse(resp.response);

    let errorString = '';
    Object.values(response.errors).forEach((error) => {
      errorString = error;
    });
    document.getElementById('success-text').innerText = errorString;
  });
});
