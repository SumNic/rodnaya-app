'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zoom', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      topic: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Europe/Moscow',
      },

      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      region: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      locality: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      zoomMeetingId: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      joinUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 🔹 Индексы (рекомендовано)
    await queryInterface.addIndex('zoom', ['startTime']);
    await queryInterface.addIndex('zoom', ['userId']);
    await queryInterface.addIndex('zoom', ['groupId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zoom');
  },
};
