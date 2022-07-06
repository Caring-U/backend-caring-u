"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class SchedulePsikolog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SchedulePsikolog.belongsTo(models.ProfilePsikolog, { foreignKey: "PsikologId" });
            
            SchedulePsikolog.hasMany(models.CustomerBooking, { foreignKey: "ScheduleId" });
        }
    }
    SchedulePsikolog.init(
        {
            PsikologId: DataTypes.INTEGER,
            day: DataTypes.DATE,
            time: DataTypes.STRING,
            price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "SchedulePsikolog",
        }
    );
    return SchedulePsikolog;
};
