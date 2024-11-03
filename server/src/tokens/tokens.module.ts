import { forwardRef, Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/common/models/users/user.model';
import { Token } from 'src/common/models/users/tokens.model';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    providers: [TokensService],
    imports: [SequelizeModule.forFeature([User, Token]), JwtModule, forwardRef(() => UsersModule)],
    exports: [TokensService],
})
export class TokensModule {}
