'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('files', 'publicationId', {
      type: Sequelize.INTEGER,
      allowNull: true, // или false, если столбец обязательный
      references: {
        model: 'publications', // Укажите связанную таблицу, если нужно
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('files', 'publicationId');
  },
};
