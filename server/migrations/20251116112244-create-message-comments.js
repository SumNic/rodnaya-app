'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('publication_comments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      video: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      publicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publications', // имя таблицы
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('publication_comments');
  }
};
