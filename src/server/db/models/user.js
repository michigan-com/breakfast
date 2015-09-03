import crypto from 'crypto';

import Sequelize from 'sequelize';

/**
 * Given a password string, sha256 hash it
 *
 * @param {String} password - Password to hash
 */
function hash(pwd) {
  let sha = crypto.createHash('sha256');
  sha.update(pwd);

  let hashed = sha.digest('hex');
  console.log(hashed);

  return hashed;
}

// Columns, etc
let attributes = {
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  password: {
    type: Sequelize.STRING,
    set: function(password) {
      this.setDataValue('password', hash(password));
    },
    allowNull: false
  },
  admin: { type: Sequelize.BOOLEAN, defaultValue: false },
  registered: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
};

// Class Methods
let instanceMethods = {
  passwordMatch: function(password) {
    return this.password === hash(password);
  }
}

module.exports = {
  attributes,
  methods: {
    instanceMethods
  }
};
