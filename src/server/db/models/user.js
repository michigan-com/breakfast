import Sequelize from 'sequelize';

let UserObj = {
  email: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
};

module.exports = UserObj;
