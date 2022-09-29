'use strict';

const { hashPassword } = require('../helpers/bcrypt');


module.exports = {
  async up (queryInterface, Sequelize) {
    let users = require('../db/users.json').map(data => {
      data.createdAt = new Date()
      data.updatedAt = new Date()
      data.password = hashPassword(data.password)
      
      return data
    })
    await queryInterface.bulkInsert('Users', users )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
