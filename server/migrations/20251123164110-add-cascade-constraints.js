'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Удаляем старые FK, если они есть
        await queryInterface.removeConstraint('files', 'files_publicationId_fkey').catch(() => {});

        // Добавляем FK с каскадом
        await queryInterface.addConstraint('files', {
            fields: ['publicationId'],
            type: 'foreign key',
            name: 'files_publicationId_fkey',
            references: {
                table: 'publications',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('files', 'files_publicationId_fkey');
    },
};
