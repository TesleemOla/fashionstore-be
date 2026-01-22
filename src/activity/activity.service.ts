import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(@InjectRepository(Activity) private repo: Repository<Activity>) {}

  async record(userId: string, type: string, meta?: any) {
    const a = this.repo.create({ userId, type, meta });
    return this.repo.save(a);
  }

  async findForUser(userId: string) {
    return this.repo.find({ where: { userId } });
  }
}