"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn("CustomerBookings", "statusBooking", {});
      await queryInterface.addColumn("CustomerBookings", "orderIdMidtrans", Sequelize.STRING);
      await queryInterface.addColumn("CustomerBookings", "VAPaymentMidtrans", Sequelize.STRING);
    },

    async down(queryInterface, Sequelize) {
      await queryInterface.addColumn("CustomerBookings", "statusBooking", Sequelize.STRING);
      await queryInterface.removeColumn("CustomerBookings", "orderIdMidtrans", {});
      await queryInterface.removeColumn("CustomerBookings", "VAPaymentMidtrans", {});

    },
};
