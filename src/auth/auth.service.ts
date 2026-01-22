import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // return safe user payload (no password)
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, roles: user.roles || ['user'] };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}