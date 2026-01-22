import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ActivityModule } from './activity/activity.module';
import { User } from './users/user.entity';
import { Item } from './items/item.entity';
import { Activity } from './activity/activity.entity';
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
      entities: [User, Item, Activity],
      synchronize: true,
      logging: false
    }),
    UsersModule,
    AuthModule,
    ItemsModule,
    ActivityModule
  ]
})
export class AppModule {}