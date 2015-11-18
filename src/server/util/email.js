let validEmailDomains = [
  'michigan.com',
  'freepress.com',
  'detroitnews.com',
  'thetimesherald.com',
  'battlecreekenquirer.com',
  'lsj.com',
  'hometownlife.com',
  'livingstondaily.com',
  'lohud.com',
  'usatoday.com'
];

// http://stackoverflow.com/a/46181/1337683
let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


/**
 * Detemins whether an email is valid or not. Tests for valid email format, and
 * also that the domain is in validEmailDomains
 *
 * @param {String} email - Email
 * @return {Boolean} True if the email is valid, false otherwise
 */
function isValidEmail(email) {

  // Reject if the email is formatted incorrectly
  if (!emailRegex.test(email)) {
    return false;
  }

  // Reject if it's not a supported domain
  let validDomain = false;
  for (let domain of validEmailDomains) {
    let regex = RegExp(`@${domain}$`);

    if (regex.test(email)) {
      validDomain = true;
      break;
    }
  }

  return validDomain === true;
}

module.exports = {
  validEmailDomains,
  emailRegex,
  isValidEmail
}
