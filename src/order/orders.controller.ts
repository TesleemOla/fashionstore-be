import { Controller, Post, Body, UseGuards, Req, Get, Param, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from '../security/jwt.guard';

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
}