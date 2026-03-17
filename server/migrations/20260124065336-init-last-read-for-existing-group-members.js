'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /*
          1. Для каждого (userId, groupId) из user_groups
          2. Находим последнее сообщение группы
          3. Считаем общее количество сообщений
          4. Вставляем или обновляем lastReadPostChat
        */

        await queryInterface.sequelize.query(`
            INSERT INTO "lastReadPostChat" (
                "userId",
                "group_id",
                "lastReadPostId",
                "countReadPosts",
                "createdAt",
                "updatedAt"
            )
            SELECT
                ug."userId",
                ug."groupId" AS group_id,
                COALESCE(MAX(gm.id), 0) AS "lastReadPostId",
                COUNT(gm.id) AS "countReadPosts",
                NOW(),
                NOW()
            FROM "user_groups" ug
            LEFT JOIN "groupMessages" gm
                ON gm."groupId" = ug."groupId"
                AND gm."blocked" = false
            GROUP BY ug."userId", ug."groupId"
            ON CONFLICT ("userId", "group_id")
            DO UPDATE SET
                "lastReadPostId" = EXCLUDED."lastReadPostId",
                "countReadPosts" = EXCLUDED."countReadPosts",
                "updatedAt" = NOW();
        `);
    },

    async down(queryInterface, Sequelize) {
        /*
          Откат:
          удаляем только те записи lastReadPostChat,
          которые соответствуют текущим участникам групп
        */
        await queryInterface.sequelize.query(`
            DELETE FROM "lastReadPostChat" lrpc
            USING "user_groups" ug
            WHERE lrpc."userId" = ug."userId"
              AND lrpc."group_id" = ug."groupId";
        `);
    },
};
