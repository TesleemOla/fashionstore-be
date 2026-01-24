import { Controller, Get, Post, Patch, UseInterceptors, UploadedFile, Body, Req, UseGuards, Param, NotFoundException, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtGuard } from '../security/jwt.guard';
import * as Multer from 'multer';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

function fileName(req, file, cb) {
  const name = `${uuidv4()}${extname(file.originalname)}`;
  cb(null, name);
}

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.itemsService.findAll(
      Number(page),
      Number(limit),
      search,
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined,
    );
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  // Protected route example - in production hook JwtGuard to protect
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: uploadDir,
        filename: fileName
      })
    })
  )
  async create(@UploadedFile() file: Multer.File, @Body() body: CreateItemDto, @Req() req: any) {
    const imageUrl = file ? `/${uploadDir}/${file.filename}` : undefined;
    const sellerId = req.user?.sub;
    return this.itemsService.create(body, sellerId, imageUrl);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateItemDto, @Req() req: any) {
    const userId = req.user.sub;
    const isAdmin = req.user.roles?.includes('admin');
    return this.itemsService.update(id, body, userId, isAdmin);
  }
}