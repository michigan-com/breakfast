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
