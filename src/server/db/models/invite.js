import Sequelize from 'sequelize';

let attributes = {
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  token: { type: Sequelize.STRING, allowNull: false },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
};

let methods;

module.exports = {
  attributes,
  methods
}
