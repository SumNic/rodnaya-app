import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddFcmDeviceTokenDto } from 'src/common/dtos/add-fcm-device-token';
import { UserDeviceToken } from 'src/common/models/users/userDeviceToken.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DeviceTokensService {
    constructor(
        @InjectModel(UserDeviceToken) private readonly deviceTokenRepository: typeof UserDeviceToken,
        private usersService: UsersService,
    ) {}

    async addDeviceToken(req: AuthenticatedRequest, dto: AddFcmDeviceTokenDto) {
        try {
            const { token, platform, deviceId } = dto;

            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: UserDeviceToken }]);

            if (!user) {
                throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
            }

            // Проверяем, есть ли уже такой токен для этого пользователя и устройства
            let existing = await this.deviceTokenRepository.findOne({
                where: { userId: req.user.id, deviceId },
            });

            if (existing) {
                // Запись найдена — проверяем токен
                if (existing.token !== token) {
                    existing.token = token;
                    existing.platform = platform; // если платформа может меняться
                    await existing.save();
                }
            } else {
                // Записи нет — создаем новую
                existing = await this.deviceTokenRepository.create({
                    token,
                    platform,
                    deviceId,
                });
                await user.$add('userDeviceTokens', existing);
            }
        } catch (err) {
            console.error(err, 'error in addDeviceToken');
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
