import { ROLES } from '@app/common';
import { AddRoleDto, CreateUserDto, User } from '@app/models';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from '../roles/roles.service';
import { Token } from '@app/models/models/users/tokens.model';
import { CreateDeclarationDto } from '@app/models/dtos/create-declaration.dto';
import { UpdatePersonaleDto } from '@app/models/dtos/update-personale.dto';
import { SecretService } from '../secret/secret.service';
import { Secret } from '@app/models/models/users/secret.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly usersRepository: typeof User,
    private roleService: RolesService,
    private secretService: SecretService,
  ) {}

  /**
   * Создать пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns User - Созданный пользователь.
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    
    const user = await this.usersRepository.create(dto);
    let role = await this.roleService.getRoleByValue(ROLES.USER);
    const secret = await this.secretService.createSecret(dto.secret);

    if (!role) {
      role = await this.roleService.create({ value: ROLES.USER });
    }

    await user.$set('roles', [role.id]);
    user.roles = [role];

    await user.$set('secret', secret);
    user.secret = secret;

    const newUser = this.getUser(user.id)

    return newUser;
  }

  /**
   * Создать пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns User - Созданный пользователь.
   */
  async updateUser(dto: CreateUserDto): Promise<User> {

    const user = await this.usersRepository.findOne({
      where: {
        vk_id: dto.vk_id
      }
    });
    
    user.update({first_name: dto.first_name, last_name: dto.last_name, photo_50: dto.photo_50, photo_max: dto.photo_max, isDelProfile: false})
    const secret = await this.secretService.createSecret(dto.secret);
    
    let role = await this.roleService.getRoleByValue(ROLES.USER);
    // const secret = await this.secretService.createSecret(dto.secret);

    if (!role) {
      role = await this.roleService.create({ value: ROLES.USER });
    }

    await user.$set('roles', [role.id]);
    user.roles = [role];

    await user.$set('secret', secret);
    user.secret = secret;

    const newUser = this.getUser(user.id)

    return newUser;
  }

  /**
   * Создать пользователя с правами администратора.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns User - Созданный пользователь.
   */
  async createAdmin(dto: CreateUserDto): Promise<User> {
    const user = await this.createUser(dto);
    let role = await this.roleService.getRoleByValue(ROLES.ADMIN);

    if (!role) {
      role = await this.roleService.create({ value: ROLES.ADMIN });
    }

    await user.$add('roles', [role.id]);
    user.roles.push(role);

    return user;
  }

  /**
   * Получить список всех пользователей.
   * @returns User[] - Список найденных пользователей.
   */
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.findAll({
      // include: { all: true },
    });

    return users;
  }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      include: [
        { 
          all: true 
        },
      ]
    });

    if (!user) return

    return user
  }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь. 
   */
  async getUserByVkId(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { vk_id: id },
      include: { all: true },
    });
  }

  /**
   * Получить пользователя по Email.
   * @param {string} email - Email пользователя.
   * @returns User - Найденный пользователь.
   */
   async getUserByTokenId(tokenId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: tokenId },
      include: { all: true },
    });

    return user;
  }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли.
   * @returns AddRoleDto - Данные роли.
   */
  async addROle(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.getUser(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$add('role', role.id);

      return dto;
    }

    throw new RpcException(
      new NotFoundException('Пользователь или роль не найдены'),
    );
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли.
   * @returns AddRoleDto - Данные роли.
   */
  async removeRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.getUser(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$remove('role', role.id);

      return dto;
    }

    throw new RpcException(
      new NotFoundException('Пользователь или роль не найдены'),
    );
  }

  /**
   * Добавить декларацию Родной партии.
   * @param {any} dto - DTO для добавления декларации.
   * @returns AddRoleDto - Данные роли.
   */
    async updatePersonale(dto: UpdatePersonaleDto): Promise<User> {
        const personale = await this.usersRepository.findOne({
            where: 
                {
                    id: dto.user_id
                }})
        await personale.update({
          first_name: dto.first_name,
          last_name: dto.last_name,
        })
        
        return personale
    }
}
