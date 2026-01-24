import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        // Use queryRunner.manager to ensure we are in the transaction
        const item = await queryRunner.manager.findOne(Item, { where: { id: itemDto.itemId } });
        if (!item) {
          throw new NotFoundException(`Item ${itemDto.itemId} not found`);
        }
        
        if (item.stock < itemDto.quantity) {
          throw new BadRequestException(`Item ${item.title} is out of stock`);
        }
        item.stock -= itemDto.quantity;
        await queryRunner.manager.save(item);

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

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }

  async hasUserPurchasedItem(userId: string, itemId: string): Promise<boolean> {
    const count = await this.orderRepo.count({
      where: {
        user: { id: userId },
        items: { item: { id: itemId } },
      },
    });
    return count > 0;
  }
}