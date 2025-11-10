import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    return await this.authService.login(res, dto);
  }

  @Post('register')
  async register(@Res() res: Response, @Body() dto: RegisterDto) {
    return await this.authService.register(res, dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Res() res: Response, @Req() req: Request) {
    console.log(req.user.email);
    return this.authService.logout(res);
  }
}
