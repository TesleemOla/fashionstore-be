import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from '../reviews/review.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, { eager: true })
  seller: User;

  @CreateDateColumn()
  createdAt: Date;
  stock: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Review, (review) => review.item)
  reviews: Review[];
}