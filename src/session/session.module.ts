import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';

@Module({
  controllers: [SessionController],
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
})
export class SessionModule {}
