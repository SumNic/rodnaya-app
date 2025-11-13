'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('chatGroups', 'groupMessages');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('groupMessages', 'chatGroups');
  },
};
