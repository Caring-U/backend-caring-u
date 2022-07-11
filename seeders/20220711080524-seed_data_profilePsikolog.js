'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    let profile = require('../db/psikologProfile.json').map(data => {
      data.createdAt = new Date()
      data.updatedAt = new Date()
      
      return data
    })
    await queryInterface.bulkInsert('ProfilePsikologs', profile )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProfilePsikologs', null, {});
  }
};
