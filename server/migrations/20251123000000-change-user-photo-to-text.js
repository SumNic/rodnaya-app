'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'photo_50', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'photo_max', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Откат: вернуть обратно STRING (255)
    await queryInterface.changeColumn('users', 'photo_50', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'photo_max', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
