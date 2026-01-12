import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Op } from 'sequelize';
import { CreateMeetingDto } from 'src/common/dtos/create-meeting.dto';
import { Group } from 'src/common/models/groups/groups.model';
import { Residency } from 'src/common/models/users/residency.model';
import { Zoom } from 'src/common/models/zoom/zoom.model';
import { ZoomView } from 'src/common/models/zoom/zoom_views.model';
import { LocationType } from 'src/common/types/types';
import { GroupsService } from 'src/groups/groups.service';
import { NotificationMessage } from 'src/queue/notifications.processor';
import { NotificationsService } from 'src/queue/notifications.service';
import { UsersService } from 'src/users/users.service';
import { ZoomGateway } from 'src/zoom/zoom.gateway';

@Injectable()
export class ZoomService {
    cachedToken: { token: string; expiresAt: number } | null = null;

    constructor(
        @InjectModel(Zoom) private readonly zoomRepository: typeof Zoom,
        @InjectModel(ZoomView) private readonly zoomViewRepository: typeof ZoomView,
        private usersService: UsersService,
        private groupsService: GroupsService,
        private notificationsService: NotificationsService,
        private readonly zoomGateway: ZoomGateway,
    ) {}

    private async getAccessToken(): Promise<string> {
        if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
            return this.cachedToken.token;
        }
        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

        const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

        //TODO убрать этот return
        // return 'eyJzdiI6IjAwMDAwMiIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjcwZDk2NDVjLWQ1YWMtNGQyZi1iZDhiLWU2ZGMzN2IzYWRkYiJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJZNFB5SWZ5LVJLZW5qd3JoWVYycG93IiwidmVyIjoxMCwiYXVpZCI6ImU4MWI5ZWZjMTc3NjkxZjJlNzcxNGVhOGFhNzVmNjM3YmE1MWY2YmY3NjgwZTFjZTJmODM1ZGNhMjAzMGU4MTAiLCJuYmYiOjE3NjgwMzcyMTksImNvZGUiOiJCMEYwd2tkTVFXLUQySkR5M2o3Z2lnMlhKWGc3UkoxTlkiLCJpc3MiOiJ6bTpjaWQ6Sl84R2cxbk1Sc3VPVlBRQkhybGVTZyIsImdubyI6MCwiZXhwIjoxNzY4MDQwODE5LCJ0eXBlIjozLCJpYXQiOjE3NjgwMzcyMTksImFpZCI6IlZwQm5ZX3Z2VFA2aGFuQ2RJbUN1dUEifQ.o084gn3EZai_CNgxTO9GbQ1GrcbRwu6X-MsegZGf3pLBOzbaetwuwYlAtX_i45nyyiLduEQTPVwYxDkhfhUFUw';
        try {
            const res = await axios.post(tokenUrl, null, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            // console.log(res.data.access_token, 'res.data.access_token');
            // console.log(res.data.expires_in, 'res.data.expires_in');

            const expiresIn = res.data.expires_in; // обычно 3600
            this.cachedToken = {
                token: res.data.access_token,
                expiresAt: Date.now() + (expiresIn - 60) * 1000, // вычитаем минуту для страховки
            };

            return this.cachedToken.token;
        } catch (error) {
            console.error('Zoom API Error:', {
                code: error.code,
                message: error.message,
                hostname: error.hostname,
            });

            throw new HttpException('Zoom auth failed', 500);
        }
    }

    async createMeeting(userId: number, dto: CreateMeetingDto) {
        const token = await this.getAccessToken();

        const user = await this.usersService.getUserWithModel(userId, [{ model: Residency }]);

        const residency = user.residency;

        const locationData = this.resolveLocation(dto.location, residency);

        const zoomRes = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                topic: dto.topic,
                agenda: dto.description,
                type: 2,
                start_time: dto.startTime,
                timezone: 'Europe/Moscow',
                duration: 60,
                // settings: {
                //     join_before_host: true,
                //     waiting_room: true,
                //     mute_upon_entry: true,
                //     auto_recording: 'cloud',
                // },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const meeting = await this.zoomRepository.create({
            topic: dto.topic,
            description: dto.description,
            startTime: new Date(dto.startTime), // 🔥 ВАЖНО
            groupId: dto.groupId,
            zoomMeetingId: zoomRes.data.id.toString(),
            joinUrl: zoomRes.data.join_url,
            userId,
            fullName: user.first_name + ' ' + user.last_name,
            ...locationData,
        });

        // 🔥 ВАЖНО: автор сразу "просмотрел" своё вече
        await this.zoomViewRepository.create({
            userId,
            zoomId: meeting.id,
        });

        if (meeting.groupId) {
            const users = await this.usersService.getUsersByGroupId(meeting.groupId);
            const group = await this.groupsService.getGroupFromId(meeting.groupId);
            const notificationMessage: NotificationMessage = {
                senderId: meeting.userId,
                title: 'Вече',
                body: meeting.topic,
            };
            await this.notificationsService.addNotifications(users, notificationMessage, group.name);
        }

        if (dto.location) {
            const locationUser = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : LocationType.GLOBAL;
            const users = await this.usersService.getUsersByResidence(locationUser);
            const notificationMessage: NotificationMessage = {
                senderId: meeting.userId,
                title: 'Вече',
                body: meeting.topic,
            };
            await this.notificationsService.addNotifications(users, notificationMessage, locationUser);
        }

        // 🔹 Эмитим через socket только нужным пользователям
        const ZoomGatewayInstance = this.zoomGateway; // инжектируем Gateway в сервис
        ZoomGatewayInstance.notifyNewVeche({
            ...meeting.toJSON(),
            groupId: meeting.groupId,
            location: dto.location,
        });

        return meeting;
    }

    private resolveLocation(
        location: CreateMeetingDto['location'],
        residency: Residency,
    ): { country?: string; region?: string; locality?: string } {
        if (!residency) {
            throw new HttpException('User residency not found', 400);
        }

        switch (location) {
            case 'world':
                return {};

            case 'country':
                return {
                    country: residency.country,
                };

            case 'region':
                return {
                    region: residency.region,
                };

            case 'locality':
                return {
                    locality: residency.locality,
                };

            default:
                return {};
        }
    }

    async getMeeting(userId: number) {
        const user = await this.usersService.getUserWithModel(userId, [{ model: Residency }, { model: Group, as: 'userGroups' }]);

        const residency = user.residency;
        const groups = user.userGroups ?? [];

        const groupIds = groups.map((g) => g.id);

        const veches = await this.zoomRepository.findAll({
            where: {
                startTime: { [Op.gt]: new Date() }, // ❗ старые веча вообще не отдаём
                [Op.or]: [
                    {
                        country: null,
                        region: null,
                        locality: null,
                        groupId: null,
                    },
                    residency?.country ? { country: residency.country } : null,
                    residency?.region ? { region: residency.region } : null,
                    residency?.locality ? { locality: residency.locality } : null,

                    groupIds.length ? { groupId: { [Op.in]: groupIds } } : null,
                ].filter(Boolean), // 🔥 убираем null-условия
            },
            include: [
                {
                    model: ZoomView,
                    as: 'views', // 🔥 обязательно совпадает с alias
                    required: false,
                    where: { userId },
                    attributes: [],
                },
            ],

            attributes: {
                include: [
                    [
                        this.zoomRepository.sequelize.literal(`
                        CASE
                          WHEN "views"."id" IS NULL THEN true
                          ELSE false
                        END
                    `),
                        'isUnread',
                    ],
                ],
            },

            order: [['startTime', 'ASC']],
            subQuery: false,
        });

        return veches;
        // return { user, meeting };
    }

    async markViewed(userId: number, zoomId: number) {
        await this.zoomViewRepository.findOrCreate({
            where: { userId, zoomId },
            defaults: { userId, zoomId },
        });
    }
}
