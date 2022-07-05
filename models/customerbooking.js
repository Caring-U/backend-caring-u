'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomerBooking.init({
    UserId: DataTypes.INTEGER,
    ScheduleId: DataTypes.INTEGER,
    linkMeet: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    statusBooking: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CustomerBooking',
  });
  return CustomerBooking;
};