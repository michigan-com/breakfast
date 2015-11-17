
function formatInviteUrl(invite) {
  let endpoint = 'http://localhost:3000';
  if (process.env.NODE_ENV) endpoint = 'http://breakfast.im';

  return `${endpoint}/register/${invite.token}/`
}

module.exports = {
  formatInviteUrl
}

