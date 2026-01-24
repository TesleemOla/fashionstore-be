import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { OrdersService } from '../order/orders.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    private usersService: UsersService,
    private itemsService: ItemsService,
    private ordersService: OrdersService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const hasPurchased = await this.ordersService.hasUserPurchasedItem(userId, dto.itemId);
    if (!hasPurchased) {
      throw new BadRequestException('You can only review items you have purchased');
    }

    const existing = await this.reviewRepo.findOne({
      where: { user: { id: userId }, item: { id: dto.itemId } }
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this item');
    }

    const user = await this.usersService.findById(userId);
    const item = await this.itemsService.findOne(dto.itemId);
    
    if (!item) throw new NotFoundException('Item not found');

    const review = this.reviewRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      user,
      item
    });
    return this.reviewRepo.save(review);
  }

  async findByItem(itemId: string) {
    return this.reviewRepo.find({
      where: { item: { id: itemId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }
}