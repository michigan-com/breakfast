'use strict';

export function formatInviteUrl(token) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV === 'production') endpoint = 'https://breakfast.im';
  else if (process.env.NODE_ENV === 'test') endpoint = 'http://test.breakfast.im';

  return `${endpoint}/register/${token}/`;
}

export function formatPasswordResetUrl(token) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV === 'production') endpoint = 'https://breakfast.im';
  else if (process.env.NODE_ENV === 'test') endpoint = 'http://test.breakfast.im';

  return `${endpoint}/password-reset/${token}/`;
}

export function getDomainFromEmail(email) {
  let domain = '';
  const match = /@(.+)$/.exec(email);
  if (match) domain = match[1];
  return domain;
}
