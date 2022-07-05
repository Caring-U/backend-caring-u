'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SchedulePsikologs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PsikologId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProfilePsikologs',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      day: {
        type: Sequelize.DATE
      },
      time: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue : 150000,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SchedulePsikologs');
  }
};