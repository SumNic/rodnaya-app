import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class BlockedUserDto {
    @ApiProperty({
        example: 1,
        description: 'id сообщения',
    })
    @IsInt({ message: 'Должно быть числом' })
    userId: number;

    @ApiProperty({
        example: 1,
        description: 'Индекс действия по отношению к сообщениям',
    })
    @IsInt({ message: 'Должно быть числом' })
    selectedPunishmentIndex: number;
}
