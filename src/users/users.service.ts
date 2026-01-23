import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

type CreateUserInput = Partial<User>;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(input: CreateUserInput) {
    const user = this.repo.create(input);
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdWithOrders(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['orders', 'orders.items', 'orders.items.item'],
    });
  }

  async findAll() {
    return this.repo.find();
  }

  async promoteToAdmin(id: string) {
    const u = await this.findById(id);
    if (!u) return null;
    u.roles = Array.from(new Set([...(u.roles || []), 'admin']));
    return this.repo.save(u);
  }
}