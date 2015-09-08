import { equal } from 'assert';

import Email from '../../src/server/util/email';

describe('Tests email parsing', function() {

  it('Tests regexing of invalid formatted emails', function() {
    let invalidEmails = [
      'this',
      'that email',
      'this@is an email',
      '12345678910',
      '@@@@@@email',
      '@gmail.com',
      'this@@@.com',
    ];

    for (let email of invalidEmails) {
      equal(Email.emailRegex.test(email), false, `Email ${email} should not be valid`)
    }
  });

  it('Tests regexing valid formatted emails', function() {
    let validEmails = [
      'test@test.com',
      'this@that.com',
      't@a.co',
      't123@123.com',
      '123@123.aw'
    ];

    for (let email of validEmails) {
      equal(Email.emailRegex.test(email), true, `Email ${email} should be valid`);
    }
  });

  it('Test the validation function', function() {
    let invalidDomains = [
      'someemail@gmail.com',
      'someotheremail@yahoo.com',
      'someemail@hotmail.com'
    ];

    for (let email of invalidDomains) {
      equal(Email.isValidEmail(email), false, `Email ${email} should be invalid`);
    }

    for (let domain of Email.validEmailDomains) {
      let testEmail = `test@${domain}`;
      equal(Email.isValidEmail(testEmail), true, `Email ${testEmail} should be valid`);
    }
  });
});
