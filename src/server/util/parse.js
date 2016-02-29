
export function formatInviteUrl(token) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV) endpoint = 'http://breakfast.im';

  return `${endpoint}/register/${token}/`
}

export function formatPasswordResetUrl(token) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV) endpoint = 'http://breakfast.im';

  return `${endpoint}/password-reset/${token}`;
}

export function getDomainFromEmail(email) {
  let domain = '';
  let match = /@(.+)$/.exec(email);
  if (match)  domain = match[1];
  return domain
}


