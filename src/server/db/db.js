import Sequelize from 'sequelize';
import { User, Invite } from './models';

function connectDb(dbString) {
  if (!dbString) {
    throw new Error('No dbString specified. Please define this enviroment variable to connect to your desired database');
  }
  var sequelize = new Sequelize(dbString, {
    logging: function() {}
  });

  // Make the models
  var UserModel = sequelize.define('user', User.attributes, User.methods);
  var InviteModel = sequelize.define('invite', Invite.attributes, Invite.methods);

  return {
    // Models
    User: UserModel,
    Invite: InviteModel,

    models: [
      UserModel,
      InviteModel
    ],

    // DB instance
    sequelize
  }
}

module.exports = {
  connectDb
}
