import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/common/constants/order';
import { ROLES } from 'src/common/constants/roles';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreatePublicationDto } from 'src/common/dtos/create-publication.dto';
import { DeletePublicationDto } from 'src/common/dtos/delete-publication.dto';
import { GetPublicationsDto } from 'src/common/dtos/get-publications.dto';
import { NewPublication } from 'src/common/dtos/new-publication.dto';
import { UpdatePublicationDto } from 'src/common/dtos/update-publication.dto';
import { Publications } from 'src/common/models/publications/publications.model';
import { Residency } from 'src/common/models/users/residency.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PublicationsService {
    constructor(
        @InjectModel(Publications) private readonly publicationsRepository: typeof Publications,
        private usersService: UsersService,
        // private readonly configService: ConfigService,
    ) {}

    async addMessage(req: AuthenticatedRequest, dto: CreatePublicationDto): Promise<NewPublication> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: Residency }]);

            const { form } = dto;
            const { message, files, video } = form;

            if (user) {
                const newPublication = await this.publicationsRepository.create({
                    country: user.residency.country,
                    region: user.residency.region,
                    locality: user.residency.locality,
                    message,
                    video,
                });
                await user.$add('publications', newPublication);
                files.length &&
                    files.map((file) => {
                        newPublication.$add('file', file.id);
                    });

                // const DATA = {
                //     v: this.configService.get<string>('VK_VERSION'),
                //     access_token: this.configService.get<string>('VK_ACCESS_TOKEN'),
                //     client_url: this.configService.get<string>('CLIENT_URL'),
                // };

                // const users = this.usersService.getAllUsers();
                // const peer_ids = (await users).map((user) => user.vk_id);

                // const params = new URLSearchParams();
                // params.append('v', DATA.v);
                // params.append('access_token', DATA.access_token);
                // params.append('peer_ids', `${peer_ids.join(',')}`);
                // params.append('random_id', '0');
                // params.append(
                //     'publication',
                //     `Отправитель: ${user.first_name} ${user.last_name} \nСообщение: ${newPublication.message} \nПерейти к сообщениям: ${DATA.client_url}/publications`,
                // );

                // const response = await fetch('https://api.vk.ru/method/messages.send', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     body: params.toString(),
                // });

                // const data = await response.json();
                // console.log('Успешно отправлено', data);

                return { message: newPublication, first_name: user.first_name, last_name: user.last_name, photo_50: user.photo_50 };
            }

            throw new HttpException('Сообщение не было отправлено', HttpStatus.FORBIDDEN);
        } catch (err) {
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Редактирует текст/видео сообщения.
     * Доступно автору сообщения или администратору.
     */
    async editMessage(user: AuthenticatedRequest['user'], dto: UpdatePublicationDto): Promise<Publications> {
        const message = await this.getPublicationFromId(dto.id_message); // из existing метода [[citation:1]]
        if (!message) {
            throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
        }
        const isAdmin = user.roles?.includes(ROLES.ADMIN);
        if (message.userId !== user.id && !isAdmin) {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
        message.message = dto.message;
        if (dto.video !== undefined) {
            message.video = dto.video;
        }
        await message.save();
        return message;
    }

    /**
     * Удаляет сообщение.
     * Доступно автору сообщения или администратору.
     */
    async deleteMessage(user: AuthenticatedRequest['user'], dto: DeletePublicationDto): Promise<{ message: string }> {
        const message = await this.getPublicationFromId(dto.id_message);
        if (!message) {
            throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
        }
        const isAdmin = user.roles?.includes(ROLES.ADMIN);
        if (message.userId !== user.id && !isAdmin) {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
        await this.publicationsRepository.destroy({ where: { id: dto.id_message } });
        return { message: 'Сообщение удалено' };
    }

    async getAllPublication(dto: GetPublicationsDto): Promise<Publications[]> {
        try {
            const { pageNumber = 1, country, region, locality } = dto; // Получаем номер страницы, по умолчанию 1
            const limit = 20; // Количество записей на страницу
            const offset = (+pageNumber - 1) * limit; // Пропускаем записи для нужной страницы

            // Формируем объект where в зависимости от переданных значений
            const where: any = { blocked: false };

            if (locality) {
                where.locality = locality;
            } else if (region) {
                where.region = region;
            } else if (country) {
                where.country = country;
            }

            const { rows } = await this.publicationsRepository.findAndCountAll({
                where,
                include: { all: true },
                order: [['id', Order.DESC]],
                limit,
                offset,
            });
            return rows;
        } catch (err) {
            throw new HttpException(`Ошибка в getAllPublication: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPublicationFromId(id: number): Promise<Publications> {
        try {
            const publication = await this.publicationsRepository.findOne({ where: { id }, include: { all: true } });
            return publication;
        } catch (err) {
            throw new HttpException(`Ошибка в getPublicationFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserPublication(dto: { id: string; pageNumber: string }): Promise<Publications[]> {
        try {
            const { pageNumber, id } = dto; // Получаем номер страницы, по умолчанию 1
            const limit = 20; // Количество записей на страницу
            const offset = (+pageNumber - 1) * limit; // Пропускаем записи для нужной страницы

            const { rows } = await this.publicationsRepository.findAndCountAll({
                where: {
                    userId: +id,
                },
                include: { all: true },
                order: [['id', Order.DESC]],
                limit,
                offset,
            });
            return rows;
        } catch (err) {
            throw new HttpException(`Ошибка в getUserPublication: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async blockedPublications(dto: BlockedMessagesDto): Promise<string> {
        try {
            const foulPublication = await this.publicationsRepository.findByPk(dto.id_message);
            if (dto.selectedActionIndex === 1 && foulPublication) {
                foulPublication.blocked = true;
                foulPublication.save();
                return 'Сообщение заблокировано';
            }
            if (dto.selectedActionIndex === 2 && foulPublication) {
                const userPublications = await this.publicationsRepository.findAll({
                    where: {
                        userId: foulPublication.userId,
                    },
                });

                // Заблокировать все сообщения
                for (const publication of userPublications) {
                    publication.blocked = true;
                    await publication.save();
                }

                return 'Все сообщения пользователя заблокированы';
            }
        } catch (err) {
            throw new HttpException(`Ошибка в blockedPublications: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
