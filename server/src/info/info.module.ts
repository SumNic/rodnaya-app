import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [InfoService],
    controllers: [InfoController],
    imports: [AuthModule],
})
export class InfoModule {}
