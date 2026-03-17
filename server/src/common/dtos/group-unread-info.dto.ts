import { ApiProperty } from '@nestjs/swagger';

export class GroupUnreadInfoDto {
    @ApiProperty({ example: 1, description: 'ID группы' })
    groupId: number;

    @ApiProperty({ example: 123, description: 'ID последнего прочитанного сообщения', nullable: true })
    lastReadPostId: number | null;

    @ApiProperty({ example: 5, description: 'Количество непрочитанных сообщений' })
    unreadCount: number;

    @ApiProperty({ example: 'world', description: 'Локаци' })
    location: string;
}
