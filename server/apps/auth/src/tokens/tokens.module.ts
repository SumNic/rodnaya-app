import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from '@app/models/models/users/tokens.model';
import { User } from '@app/models/models/users/user.model';
import { UserModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Token]), UserModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
