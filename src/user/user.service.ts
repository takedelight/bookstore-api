import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userPresitory: Repository<User>,
  ) {}

  async getAllUsers() {
    return this.userPresitory.find({
      select: ['id', 'first_name', 'last_name', 'email', 'role'],
    });
  }

  async findById(id: string) {
    const user = await this.userPresitory.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }
  async findByEmail(email: string) {
    const user = await this.userPresitory.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    try {
      const isExist = await this.userPresitory.findOne({
        where: { email: dto.email },
      });

      if (isExist) {
        throw new ConflictException('Користувач з такою поштою вже існує');
      }

      const newUser = await this.userPresitory.save({
        ...dto,
        password: await hash(dto.password),
      });
      return newUser;
    } catch {
      throw new BadRequestException(
        'Помилка під час створення користувача,будь ласка, спробуйте знову',
      );
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.findById(id);
      await this.userPresitory.update(user.id, {
        ...dto,
        password: dto.password && (await hash(dto.password)),
      });
      return this.findById(id);
    } catch {
      throw new BadRequestException(
        'Помилка під час оновлення користувача,будь ласка, спробуйте знову',
      );
    }
  }

  async delete(id: string) {
    try {
      const user = await this.findById(id);
      await this.userPresitory.remove(user);
    } catch {
      throw new BadRequestException('Помилка під час видалення користувача');
    }
  }
}
