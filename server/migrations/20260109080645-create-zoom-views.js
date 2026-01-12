'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zoom_views', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      zoom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zoom',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // 🔥 Уникальный индекс (один просмотр на пользователя и вече)
    await queryInterface.addIndex(
      'zoom_views',
      ['user_id', 'zoom_id'],
      {
        unique: true,
        name: 'zoom_views_user_zoom_unique',
      },
    );

    // ⚡ Индексы для скорости
    await queryInterface.addIndex(
      'zoom_views',
      ['user_id'],
      { name: 'zoom_views_user_idx' },
    );

    await queryInterface.addIndex(
      'zoom_views',
      ['zoom_id'],
      { name: 'zoom_views_zoom_idx' },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('zoom_views');
  },
};
