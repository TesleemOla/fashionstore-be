import { Controller, Post, Patch, Body, UseGuards, Req, Get, Param, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order.entity';
import { JwtGuard } from '../security/jwt.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Req() req: any, @Body() body: CreateOrderDto) {
    const userId = req.user.sub;
    return this.ordersService.create(userId, body);
  }

  @Get()
  async list(@Req() req: any) {
    const userId = req.user.sub;
    return this.ordersService.findAllForUser(userId);
  }

  @Get(':id')
  async get(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    const order = await this.ordersService.findOne(id, userId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }
}