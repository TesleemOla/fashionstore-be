import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @UpdateDateColumn()
  updatedAt: Date;
}