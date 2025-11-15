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
  async login(
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: LoginDto,
  ) {
    return await this.authService.login(res, req, dto);
  }

  @Post('register')
  async register(
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: RegisterDto,
  ) {
    return await this.authService.register(res, req, dto);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    return await this.authService.refresh(req, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
