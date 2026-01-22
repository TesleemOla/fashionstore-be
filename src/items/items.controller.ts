import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, Req, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtGuard } from '../security/jwt.guard';
import Multer from 'multer';
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
  async list() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async get() {
    // placeholder
    return { message: 'implement get by id' };
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
}