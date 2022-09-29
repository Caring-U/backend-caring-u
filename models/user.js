"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasMany(models.ProfilePsikolog, { foreignKey: "UserId" });
            User.hasMany(models.CustomerBooking, { foreignKey: "UserId" });
        }
    }

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notNull: { msg: "Username can not be null" },
                    notEmpty: { msg: "Username can not be empty" },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: { msg: "Email format is not correct" },
                    notNull: { msg: "Email can not be null" },
                    notEmpty: { msg: "Email can not be empty" },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Password can not be null" },
                    notEmpty: { msg: "Password can not be empty" },
                },
            },
            role: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
            hooks: {
                beforeCreate(user) {
                    user.password = hashPassword(user.password);
                },
            },
        }
    );
    return User;
};
