import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MobileAppInfoDto } from 'src/common/dtos/mobile-app-info.dto';
import { Info } from 'src/common/models/info/info.model';

@Injectable()
export class InfoService {
    constructor(
        @InjectModel(Info)
        private readonly infoRepository: typeof Info,
    ) {}
    async getInfoMobilApp(): Promise<MobileAppInfoDto> {
        try {
            const info = await this.infoRepository.findOne({
                order: [['id', 'DESC']],
            });

            return {
                message: `Доступна новая версия приложения ${info?.version_app}`,
                action: 'update_app',
                version: info?.version_app,
            };
        } catch (err) {
            throw new HttpException(`Ошибка в getLocation: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addVersionApp(versionApp: string) {
        try {
            await this.infoRepository.create({
                version_app: versionApp,
            });
        } catch (err) {
            console.error(err, 'error in addVersionApp');
            throw new HttpException(`Ошибка в addVersionApp: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
