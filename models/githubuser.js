'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GithubUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GithubUser.init({
    username: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    githubCreatedDate: {
      type: DataTypes.DATE
    },
    emailed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'GithubUser',
  });
  return GithubUser;
};