import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';

export class EndMessageDto {
    @ApiProperty({
        example: '1',
        description: 'id пользователя',
    })
    @IsString({ message: 'Должно быть строкой' })
    id: string;

    @ApiProperty({
        example: 'sdfsfsdgggg',
        description: 'Проверка состояния',
    })
    @IsString({ message: 'Должно быть строкой' })
    secret: string;

    residency: CreateLocationDto;

    // @ApiProperty({
    //     example: 'Место жительства',
    //     description: 'Страна, регион, или район',
    // })
    // @IsString({ message: 'Должно быть строкой' })
    // location: string;
}
