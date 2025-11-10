import { Session } from 'src/session/entity/session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  first_name: string;
  @Column('varchar', { nullable: true })
  last_name: string;
  @Column('varchar', { unique: true })
  email: string;
  @Column('varchar')
  password: string;
  @Column({ enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Session, (session) => session.user)
  @JoinColumn()
  sessions: Session[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
