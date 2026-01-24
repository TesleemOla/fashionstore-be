import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtGuard } from '../security/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: any, @Body() body: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, body);
  }

  @Get('item/:itemId')
  findByItem(@Param('itemId') itemId: string) {
    return this.reviewsService.findByItem(itemId);
  }
}