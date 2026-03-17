'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex(
            'lastReadPostChat',
            ['group_id', 'userId'],
            {
                unique: true,
                name: 'uniq_last_read_post_chat_group_user',
            },
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex(
            'lastReadPostChat',
            'uniq_last_read_post_chat_group_user',
        );
    },
};
