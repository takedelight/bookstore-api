import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  ip: string;

  @Column('varchar')
  userAgent: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
