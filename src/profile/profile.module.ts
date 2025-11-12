import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/session/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Session } from 'src/session/entity/session.entity';

@Module({
  controllers: [ProfileController],
  imports: [TypeOrmModule.forFeature([User, Session])],
  providers: [ProfileService, UserService, SessionService],
})
export class ProfileModule {}
