import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async create(userId: string, ip: string, userAgent: string) {
    const session = this.sessionRepository.create({
      ip,
      userAgent,
      user: { id: userId },
    });

    return this.sessionRepository.save(session);
  }

  async delete(id: string) {
    return await this.sessionRepository.delete(id);
  }
}
