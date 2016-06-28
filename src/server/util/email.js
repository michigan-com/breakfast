'use strict';

import debug from 'debug';

import marketInfo from '../../marketInfo.json';

const logger = debug('breakfast:util:email');

// http://stackoverflow.com/a/46181/1337683
const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function getValidEmailDomains() {
  const validEmailDomains = [];
  Object.values(marketInfo).forEach((market) => { validEmailDomains.push(market.domain); });
  return validEmailDomains;
}

/**
 * Detemins whether an email is valid or not. Tests for valid email format, and
 * also that the domain is in validEmailDomains
 *
 * @param {String} email - Email
 * @return {Boolean} True if the email is valid, false otherwise
 */
function isValidEmail(email) {
  logger(`Testing ${email}`);

  // Reject if the email is formatted incorrectly
  // if (!emailRegex.test(email)) {
    // logger(`${email} failed email regex`)
    // return false;
  // }

  // Reject if it's not a supported domain
  let validDomain = false;
  for (const domain of getValidEmailDomains()) {
    if (domain === '*') continue;

    const regex = RegExp(`@${domain}$`);

    if (regex.test(email)) {
      logger(`${domain} worked!`);
      validDomain = true;
      break;
    }
  }

  return validDomain === true;
}

module.exports = {
  getValidEmailDomains,
  emailRegex,
  isValidEmail,
};
