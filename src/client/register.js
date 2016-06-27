'use strict';

// import xr from 'xr';
import React from 'react';
import { render } from 'react-dom';

// import $ from './util/$';
import Store from './register/store';
import RegisterForm from './register/form';

function drawForm() {
  const state = Store.getState();
  render(
    <RegisterForm Input={state.Input} />,
    document.getElementById('register-form')
  );
}

drawForm();

Store.subscribe(drawForm);


// // Hotwire the form sending
// $('form.register-form').on('submit', function(e) {
//
//   e.preventDefault();
//   e.stopPropagation();
//
//   // Get the values from the form inputj
//   let _csrf = $('.form-field._csrf input').val();
//   let username = $('.form-field.username input').val();
//   let selectedIndex = $('#domains')[0].selectedIndex;
//   let domain = domainSelect.currentSelection();
//   let email = `${username}@${domain}`;
//   let values = {
//     _csrf,
//     email
//   };
//
//   if (!username) {
//     return;
//   }
//
//   xr.post('/register/', values).then(function(resp) {
//     document.getElementById('success-text').innerText = `Please check your email for confirmation.`;
//     let submit = document.getElementById('submit');
//
//     submit.setAttribute('disabled', true);
//     submit.value = '✓';
//
//   }, function(resp) {
//     let response = JSON.parse(resp.response);
//
//     for (var error in response.error) {
//       let errorString = response.error[error];
//
//       if (error === 'email') {
//         error = 'username';
//       }
//
//       document.getElementById('success-text').innerText = errorString;
//     }
//   });
// });
