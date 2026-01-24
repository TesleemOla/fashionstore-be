import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { UsersModule } from '../users/users.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UsersModule, ActivityModule],
  providers: [ItemsService],
  controllers: [ItemsController],
  exports: [ItemsService]
})
export class ItemsModule {}