import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository, ILike, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UsersService } from '../users/users.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private repo: Repository<Item>,
    private usersService: UsersService,
    private activityService: ActivityService
  ) {}

  async create(createDto: CreateItemDto, sellerId: string, imageUrl?: string) {
    const seller = await this.usersService.findById(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    const item = this.repo.create({ ...createDto, seller, imageUrl });
    const saved = await this.repo.save(item);
    await this.activityService.record(sellerId, 'upload_item', { itemId: saved.id, title: saved.title });
    return saved;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, minPrice?: number, maxPrice?: number) {
    const where: any = {};

    if (search) {
      // ILike is case-insensitive (Postgres specific)
      where.title = ILike(`%${search}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      relations: ['seller'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}