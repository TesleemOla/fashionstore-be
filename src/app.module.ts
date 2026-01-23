import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ActivityModule } from './activity/activity.module';
import { OrdersModule } from './order/orders.module';
import { CartsModule } from './cart/carts.module';
import { User } from './users/user.entity';
import { Item } from './items/item.entity';
import { Activity } from './activity/activity.entity';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASS || 'postgres',
      database: process.env.DATABASE_NAME || 'fashionstore',
      entities: [User, Item, Activity, Order, OrderItem, Cart, CartItem],
      synchronize: true,
      logging: false
    }),
    UsersModule,
    AuthModule,
    ItemsModule,
    ActivityModule,
    OrdersModule,
    CartsModule
  ]
})
export class AppModule {}