import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtGuard } from '../security/jwt.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartsController {
  constructor(private cartsService: CartsService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartsService.getCart(req.user.sub);
  }

  @Post()
  addToCart(@Req() req: any, @Body() body: AddToCartDto) {
    return this.cartsService.addToCart(req.user.sub, body);
  }

  @Delete(':itemId')
  removeFromCart(@Req() req: any, @Param('itemId') itemId: string) {
    return this.cartsService.removeFromCart(req.user.sub, itemId);
  }

  @Post('checkout')
  checkout(@Req() req: any) {
    return this.cartsService.checkout(req.user.sub);
  }
}