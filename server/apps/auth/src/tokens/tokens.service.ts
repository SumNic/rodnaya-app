import { RefreshTokensDto } from '@app/models';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';
import { Token } from '@app/models/models/users/tokens.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TokensService {

    constructor(
    @InjectModel(Token) private readonly tokenRepository: typeof Token
  ) {}

  /**
   * Получить refreshToken по UUID.
   * @param {string} uuid - uuid пользователя.
   * @returns User - Найденный пользователь.
   */
  async getRefreshToken(uuid: string): Promise<Token> {

    const token = await this.tokenRepository.findOne({
      where: { uuid: uuid },
    })

    return token

  }

  /**
   * Создать запись в базе данных refresh token для используемого устройства.
   * @param {string} email - Email пользователя.
   * @returns User - Найденный пользователь.
   */
  async createRefreshToken(dto: RefreshTokensDto): Promise<Token> {
    const token = await this.tokenRepository.create(dto);
    // let role = await this.roleService.getRoleByValue(ROLES.USER);

    // if (!role) {
    //   role = await this.roleService.create({ value: ROLES.USER });
    // }

    // await user.$set('roles', [role.id]);
    // user.roles = [role];

    return token;
  }

  /**
   * Обновить refreshToken у пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   * @param {string} hashToken - Захешированный новый refreshToken
   * @throws RpcException(NotFoundException)
   */
  async updateRefreshToken(dto: RefreshTokensDto): Promise<Token> {
    const token = await this.tokenRepository.findOne({where: {uuid: dto.uuid}});

    if (!token) {
      throw new RpcException(new NotFoundException('Токен не найден'));
    }

    token.refreshToken = dto.refreshToken;
    await token.save();

    return token
  }

  /**
   * Удалить refreshToken у пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   * @throws RpcException(NotFoundException)
   */
  async removeRefreshToken(dto: LogoutUserDto): Promise<void> {
    if (dto.allDeviceExit) {
      const tokens = await this.tokenRepository.update({refreshToken: null}, {
          where: {
            userId: dto.id
          }
        });
        return
    }
    const token = await this.tokenRepository.findOne({where: {uuid: dto.uuid}});

    if (!token) {
      throw new RpcException(new NotFoundException('Токен не найден'));
    }

    token.refreshToken = null;
    await token.save();
  }
}
