'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('declarations', 'declaration', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Откат: вернуть обратно STRING (255)
    await queryInterface.changeColumn('declarations', 'declaration', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
