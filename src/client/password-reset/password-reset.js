'use strict';

import xr from 'xr';

import $ from '../util/$';


$('form.password-reset-form').on('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  let url = e.target.getAttribute('action');
  let password = $('.form-field.password input').val();
  let confirmPassword = $('.form-field.confirmPassword input').val();
  let _csrf = $('.form-field input').val();
  let values = { password, confirmPassword, _csrf };

  xr.post(url, values).then((resp) => {
    document.getElementById('success-text').innerHTML = '<p>Password successfully changed</p><p>Please <a href=\'/login/\'>Login</a> with your new password.'
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
