import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VkLoginAndroidDto {
    @ApiProperty({
        example: 'QGvH-8oEHe7seNqn5',
        description: 'device_id VK',
    })
    @IsString({ message: 'Должно быть строкой' })
    device_id: string;

    @ApiProperty({
        example: 'Q-w-rLTxyi02R206ST3..',
        description: 'Токен доступа VK',
    })
    @IsString({ message: 'Должно быть строкой' })
    code: string;

    @ApiProperty({
        example: 'Q-w-rLTxyi02R206ST3..',
        description: 'Токен доступа VK',
    })
    @IsString({ message: 'Должно быть строкой' })
    code_verifier: string;
}
