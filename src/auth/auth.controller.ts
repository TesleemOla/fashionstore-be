import { Controller, Post, Body, Res, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { COOKIE_NAME } from './constants';
import { LocalAuthGuard } from './local-auth.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { JwtGuard } from '../security/jwt.guard';

class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const hashed = await bcrypt.hash(body.password, 10);
    const user = await this.usersService.create({
      email: body.email,
      password: hashed,
      name: body.name
    });
    const { password, ...safe } = user;
    return safe;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // LocalAuthGuard attaches user to req.user
    const user = (req as any).user;
    const tokens = await this.authService.login(user);
    res.cookie(COOKIE_NAME, tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return res.json({ message: 'ok' });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie(COOKIE_NAME);
    return res.json({ message: 'logged out' });
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.usersService.findByIdWithOrders(req.user.sub);
  }
}