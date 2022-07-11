'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    let schedule = require('../db/schedulePsikolog.json').map(data => {
      data.createdAt = new Date()
      data.updatedAt = new Date()
      
      return data
    })
    await queryInterface.bulkInsert('SchedulePsikologs', schedule )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SchedulePsikologs', null, {});
  }
};
