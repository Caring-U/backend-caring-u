'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    let booking = require('../db/customerBooking.json').map(data => {
      data.createdAt = new Date()
      data.updatedAt = new Date()
      
      return data
    })
    await queryInterface.bulkInsert('CustomerBookings', booking )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CustomerBookings', null, {});
  }
};
