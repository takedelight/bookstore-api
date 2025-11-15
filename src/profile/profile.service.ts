import { Injectable } from '@nestjs/common';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    const sessions = await this.sessionService.get(userId);

    const { password, ...rest } = user;

    return {
      ...rest,
      sessions,
    };
  }
}
