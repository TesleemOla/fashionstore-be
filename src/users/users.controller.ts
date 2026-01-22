import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async list() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // admin-only endpoint
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post(':id/promote')
  async promote(@Param('id') id: string) {
    return this.usersService.promoteToAdmin(id);
  }
}