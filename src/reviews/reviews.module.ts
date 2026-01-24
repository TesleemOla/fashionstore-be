import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { OrdersModule } from '../order/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    UsersModule,
    ItemsModule,
    OrdersModule
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}