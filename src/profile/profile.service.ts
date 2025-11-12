import { Injectable } from '@nestjs/common';
import { SessionService } from 'src/session/session.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}
}
