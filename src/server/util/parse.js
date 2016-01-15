
function formatInviteUrl(token) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV) endpoint = 'http://breakfast.im';

  return `${endpoint}/register/${token}/`
}

function getDomainFromEmail(email) {
  let domain = '';
  let match = /@(.+)$/.exec(email);
  if (match)  domain = match[1];
  return domain
}

module.exports = {
  formatInviteUrl,
  getDomainFromEmail
}

