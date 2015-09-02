import Crypto from 'crypto';

import Sequelize from 'sequelize';

let UserObj = {
  email: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  admin: { type: Sequelize.BOOLEAN, defaultValue: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
};

module.exports = UserObj;
