import { Role } from 'src/user/entity/user.entity';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
};
