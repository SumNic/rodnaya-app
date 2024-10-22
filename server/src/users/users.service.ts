import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ROLES } from 'src/common/constants/roles';
import { AddRoleDto } from 'src/common/dtos/add-role.dto';
import { BlockedUserDto } from 'src/common/dtos/blocked-user.dto';
import { CreateDeclarationDto } from 'src/common/dtos/create-declaration.dto';
import { CreateResidencyDto } from 'src/common/dtos/create-residency.dto';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { GetDeclarationDto } from 'src/common/dtos/get-declaration.dto';
import { UpdatePersonaleDto } from 'src/common/dtos/update-personale.dto';
import { User } from 'src/common/models/users/user.model';
import { DeclarationService } from 'src/declaration/declaration.service';
import { EndReadMessageService } from 'src/end-read-message/end-read-message.service';
import { FilesService } from 'src/files/files.service';
import { ResidencyService } from 'src/residency/residency.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private readonly usersRepository: typeof User,
        private roleService: RolesService,
        private residencyService: ResidencyService,
        private readonly endReadMessageService: EndReadMessageService,
        private declarationService: DeclarationService,
        private filesService: FilesService,
        private readonly configService: ConfigService,
    ) {}
    
    async createUser(dto: CreateUserDto): Promise<User> {
        try {
            const user = await this.usersRepository.create(dto);
            let role = await this.roleService.getRoleByValue(ROLES.USER);
    
            if (!role) {
                role = await this.roleService.create({ value: ROLES.USER });
            }
    
            await user.$set('roles', [role.id]);
            user.roles = [role];
    
            const newUser = await this.getUser(user.id);
            return newUser;
        } catch (err) {
            throw new HttpException(`Ошибка в createUser: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async updateUser(dto: CreateUserDto): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: {
                    vk_id: dto.vk_id,
                },
            });
    
            user.update({ first_name: dto.first_name, last_name: dto.last_name, photo_50: dto.photo_50, photo_max: dto.photo_max });
    
            let role = await this.roleService.getRoleByValue(ROLES.USER);
    
            if (!role) {
                role = await this.roleService.create({ value: ROLES.USER });
            }
    
            await user.$set('roles', [role.id]);
            user.roles = [role];
            await user.save();
    
            const newUser = await this.getUser(user.id);
            return newUser;
        } catch (err) {
            throw new HttpException(`Ошибка в updateUser: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async createAdmin(dto: CreateUserDto): Promise<User> {
        try {
            const user = await this.createUser(dto);
            let role = await this.roleService.getRoleByValue(ROLES.ADMIN);
    
            if (!role) {
                role = await this.roleService.create({ value: ROLES.ADMIN });
            }
    
            await user.$add('roles', [role.id]);
            user.roles.push(role);
            return user;
        } catch (err) {
            throw new HttpException(`Ошибка в createAdmin: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.usersRepository.findAll({
                // include: { all: true },
            });
            return users;
        } catch (err) {
            throw new HttpException(`Ошибка в getAllUsers: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUser(id: number): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { id },
                include: [
                    {
                        all: true,
                    },
                ],
            });
    
            if (!user) return;
            return user;
        } catch (err) {
            throw new HttpException(`Ошибка в getUser: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUserByVkId(id: number): Promise<User> {
        try {
            return await this.usersRepository.findOne({
                where: { vk_id: id },
                include: { all: true },
            });
        } catch (err) {
            throw new HttpException(`Ошибка в getUserByVkId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUserByTokenId(tokenId: number): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: { id: tokenId },
                include: { all: true },
            });
            return user;
        } catch (err) {
            throw new HttpException(`Ошибка в getUserByTokenId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
        try {
            const user = await this.getUser(dto.userId);
            const role = await this.roleService.getRoleByValue(dto.value);
    
            if (role && user) {
                await user.$add('role', role.id);
                return dto;
            }
    
            throw new HttpException('Пользователь или роль не найдены', HttpStatus.BAD_REQUEST);
        } catch (err) {
            throw new HttpException(`Ошибка в addRole: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async removeRole(dto: AddRoleDto): Promise<AddRoleDto> {
        try {
            const user = await this.getUser(dto.userId);
            const role = await this.roleService.getRoleByValue(dto.value);
    
            if (role && user) {
                await user.$remove('role', role.id);
                return dto;
            }
    
            throw new HttpException('Пользователь или роль не найдены', HttpStatus.BAD_REQUEST);
        } catch (err) {
            throw new HttpException(`Ошибка в removeRole: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async updatePersonale(dto: UpdatePersonaleDto): Promise<User> {
        try {
            const personale = await this.usersRepository.findOne({
                where: {
                    id: dto.user_id,
                },
            });
            await personale.update({
                first_name: dto.first_name,
                last_name: dto.last_name,
            });
            return personale;
        } catch (err) {
            throw new HttpException(`Ошибка в updatePersonale: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async blockedUser(dto: BlockedUserDto): Promise<string> {
        try {
            const user = await this.getUser(dto.userId);

            let timeBlocked: string;
            switch (dto.selectedPunishmentIndex) {
                case 1:
                    timeBlocked = '1 день';
                    break;
                case 2:
                    timeBlocked = '1 неделю';
                    break;
                case 3:
                    timeBlocked = '1 месяц';
                    break;
                case 4:
                    timeBlocked = '1 год';
                    break;
                case 5:
                    timeBlocked = 'навсегда';
                    break;
                default:
                    throw new HttpException('Ошибка', HttpStatus.BAD_REQUEST);
            }

            if (dto.selectedPunishmentIndex === 5) {
                user.blockedforever = true;
                user.isRegistration = false;
                user.save();
                return 'Пользователь заблокирован навсегда';
            }

            user.blocked = true;
            user.blockeduntil = new Date(Date.now() + this.getDuration(timeBlocked));
            user.save();
            return `Пользователь заблокирован на ${timeBlocked}`;
        } catch (err) {
            throw new HttpException(`Ошибка в blockedUser: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private getDuration(timeString: string): number {
        const [value, unit] = timeString.split(' ');
        const duration = parseInt(value, 10);
        switch (unit) {
            case 'день':
                return duration * 24 * 60 * 60 * 1000;
            case 'неделю':
                return duration * 7 * 24 * 60 * 60 * 1000;
            case 'месяц':
                return duration * 30 * 24 * 60 * 60 * 1000;
            case 'год':
                return duration * 365 * 24 * 60 * 60 * 1000;
            default:
                return 0;
        }
    }
    
    async checkBlocked(userId: number): Promise<Date> {
        try {
            const user = await this.getUser(userId);
            if (user && user.blockeduntil) return user.blockeduntil;
            return null;
        } catch (err) {
            throw new HttpException(`Ошибка в checkBlocked: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async createResidencyForUser(dto: CreateResidencyDto): Promise<User> {
        try {
            const user = await this.getUser(dto.id);

            if (dto.secret !== user.secret) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            }

            const newDateEditResidency = user.dateEditResidency
                ? user.dateEditResidency.setMonth(user.dateEditResidency.getMonth() + 1)
                : new Date();

            if (!user.dateEditResidency || new Date() < newDateEditResidency) {
                // Заменить < на >
                const arrResidencyUser = ['Земля', dto.country, dto.region, dto.locality];
                // Удалить все строки, которые не соответсвуют arrResidencyUser для данного user
                await this.endReadMessageService.deleteOldLocations(dto.id, arrResidencyUser);

                const residency = await this.residencyService.getOrCreateResidency(dto);
                const residencyFromId = await this.residencyService.getResidency(residency.id);
                await residencyFromId.$add('users', [dto.id]);
                await residencyFromId.save();
                user.dateEditResidency = new Date();
                await user.save();

                await Promise.all(
                    arrResidencyUser.map(async (location) => {
                        const endReadMessages = await this.endReadMessageService.setNewEndReadMessages(dto.id, location);
                        await endReadMessages.$set('users', [dto.id]);
                        await endReadMessages.save();
                    }),
                );

                const userNew = await this.getUser(dto.id);

                return userNew;
            } else {
                throw new HttpException(`${newDateEditResidency}`, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async addDeclaration(dto: CreateDeclarationDto): Promise<User> {
        try {
            const user = await this.getUser(dto.id);

        if (dto.secret !== user.secret) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }

        if (!user.declaration) {
            const declaration = await this.declarationService.createDeclaration(dto.declaration);
            await user.$set('declaration', declaration);
            user.declaration = declaration;
            await user.save();
        } else {
            await this.declarationService.updateDeclaration(dto);
        }
        const userFromDeclaration = await this.getUser(dto.id);

        return userFromDeclaration;
        } catch (err) {
            throw new HttpException(`Ошибка в addDeclaration: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getDeclaration(id: number): Promise<GetDeclarationDto> {
        try {
            const user = await this.getUser(id);

        if (user.declaration.declaration) return user.declaration;

        return;
        } catch (err) {
            throw new HttpException(`Ошибка в getDeclaration: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async saveAvatar(file: Express.Multer.File, userId: string): Promise<User> {
        try {
            const avatar = await this.filesService.saveFile(file);
            const user = await this.getUser(+userId);

            if (!avatar || !user) {
                throw new HttpException('Не удалось сменить аватар', HttpStatus.FORBIDDEN);
            }

            user.update({
                photo_50: `${this.configService.get<string>('DOMEN')}/${avatar.dataValues.fileNameUuid}`,
                photo_max: `${this.configService.get<string>('DOMEN')}/${avatar.dataValues.fileNameUuid}`,
            });
            user.save();

            return user;
        } catch (err) {
            throw new HttpException(`Ошибка в saveAvatar: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
    
    async udatePersonaleData(secret: string, form: UpdatePersonaleDto): Promise<User> {
        try {
            const user = await this.getUser(form.user_id);

            if (secret !== user.secret) {
                throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
            }

            const personale = await this.updatePersonale(form);

            const userFromPersonale = await this.getUser(form.user_id);

            return userFromPersonale;
        } catch (err) {
            throw new HttpException(`Ошибка в udatePersonaleData: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
