import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DevicePlatform } from 'src/common/types/types';

export class AddFcmDeviceTokenDto {
    @ApiProperty({
        example: 'sdfsdfs',
        description: 'fcm токен',
    })
    @IsString({ message: 'Должно быть строкой' })
    token: string;

    @ApiProperty({
        example: '1',
        description: 'Идентификатор девайса',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    deviceId?: string;

    @ApiProperty({
        example: DevicePlatform.ANDROID,
        enum: DevicePlatform,
        description: 'Платформа девайса',
    })
    @IsEnum(DevicePlatform, { message: 'Платформа должна быть android, ios, web или unknown' })
    platform: DevicePlatform;
}
