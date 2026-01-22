import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { Repository } from 'typeorm';
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
    const item = this.repo.create({ ...createDto, seller, imageUrl });
    const saved = await this.repo.save(item);
    await this.activityService.record(sellerId, 'upload_item', { itemId: saved.id, title: saved.title });
    return saved;
  }

  async findAll() {
    return this.repo.find({ relations: ['seller'] });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}