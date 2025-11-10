import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import type { CookieOptions, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { parseTime } from 'src/shared/utils/parse-time.util';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async validate(email: string, userPassword: string) {
    const user = await this.userService.findByEmail(email);

    const isPasswordValid = await verify(user.password, userPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль');
    }
    return user;
  }

  async login(res: Response, req: Request, dto: LoginDto) {
    const user = await this.validate(dto.email, dto.password);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    this.setCookie(res, 'refresh_token', refreshToken, {
      expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    });

    this.setCookie(res, 'access_token', accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.sessionService.create(
      user.id,
      req.ip!,
      req.headers['user-agent']!,
    );

    res.sendStatus(200);
  }

  async register(res: Response, req: Request, dto: RegisterDto) {
    const user = await this.userService.create(dto);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
    );

    this.setCookie(res, 'refresh_token', refreshToken, {
      expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    });

    this.setCookie(res, 'access_token', accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.sessionService.create(
      user.id,
      req.ip!,
      req.headers['user-agent']!,
    );

    res.sendStatus(200);
  }

  logout(res: Response) {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');

    return res.sendStatus(200);
  }

  async generateTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync({ userId, email });
    const refreshToken = await this.jwtService.signAsync(
      { userId, email },
      {
        expiresIn: parseTime(
          this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
        ),
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }

  setCookie(
    res: Response,
    key: string,
    value: string,
    options?: CookieOptions,
  ) {
    res.cookie(key, value, {
      ...options,
      httpOnly: true,
      sameSite: 'lax',
      domain: this.configService.getOrThrow<string>('COOKIE_DOMAIN'),
      secure: this.configService.getOrThrow<boolean>('COOKIE_SECURE'),
    });
  }
}
