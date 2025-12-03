import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MobileAppInfoDto {
    @ApiProperty({
        example: 'Доступна новая версия приложения',
        description: 'Сообщение',
    })
    @IsString({ message: 'Должно быть строкой' })
    message: string;

    @ApiProperty({
        example: 'update_action',
        description: 'Действие',
    })
    @IsString({ message: 'Должно быть строкой' })
    action: string;

    @ApiProperty({
        example: '1.0.0',
        description: 'Версия приложения',
    })
    @IsString({ message: 'Должно быть строкой' })
    version: string;
}
