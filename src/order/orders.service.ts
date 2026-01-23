import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { Item } from '../items/item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Item) private itemRepo: Repository<Item>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.user = user;
      order.status = OrderStatus.PENDING;
      order.items = [];
      let total = 0;

      for (const itemDto of createOrderDto.items) {
        const item = await this.itemRepo.findOne({ where: { id: itemDto.itemId } });
        if (!item) {
          throw new NotFoundException(`Item ${itemDto.itemId} not found`);
        }

        const orderItem = new OrderItem();
        orderItem.item = item;
        orderItem.quantity = itemDto.quantity;
        orderItem.price = item.price;
        order.items.push(orderItem);

        total += Number(item.price) * itemDto.quantity;
      }

      order.total = total;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllForUser(userId: string) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.item'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.orderRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.item'],
    });
  }
}