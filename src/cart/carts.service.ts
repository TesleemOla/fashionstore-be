import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { UsersService } from '../users/users.service';
import { Item } from '../items/item.entity';
import { OrdersService } from '../order/orders.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Item) private itemRepo: Repository<Item>,
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.item'],
    });

    if (!cart) {
      const user = await this.usersService.findById(userId);
      if (!user) throw new NotFoundException('User not found');
      cart = this.cartRepo.create({ user, items: [] });
      await this.cartRepo.save(cart);
    }
    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const cart = await this.getCart(userId);
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');

    if (item.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    let cartItem = cart.items.find((ci) => ci.item.id === item.id);
    if (cartItem) {
      if (cartItem.quantity + dto.quantity > item.stock) {
        throw new BadRequestException('Not enough stock available');
      }
      cartItem.quantity += dto.quantity;
    } else {
      cartItem = this.cartItemRepo.create({
        cart,
        item,
        quantity: dto.quantity,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepo.save(cartItem);
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    const cartItem = cart.items.find((ci) => ci.item.id === itemId);
    if (cartItem) {
      await this.cartItemRepo.remove(cartItem);
    }
    return this.getCart(userId);
  }

  async checkout(userId: string) {
    const cart = await this.getCart(userId);
    if (cart.items.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    const orderDto = {
      items: cart.items.map((ci) => ({
        itemId: ci.item.id,
        quantity: ci.quantity,
      })),
    };
    const order = await this.ordersService.create(userId, orderDto);
    await this.cartItemRepo.remove(cart.items);
    return order;
  }
}