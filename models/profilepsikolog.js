'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfilePsikolog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProfilePsikolog.hasMany(models.SchedulePsikolog, {foreignKey : 'PsikologId'})
      ProfilePsikolog.belongsTo(models.User, {foreignKey : 'UserId'})
    }
  }
  ProfilePsikolog.init({
    UserId: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    certificate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfilePsikolog',
  });
  return ProfilePsikolog;
};