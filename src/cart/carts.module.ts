import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../order/orders.module';
import { Item } from '../items/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Item]),
    UsersModule,
    OrdersModule
  ],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}