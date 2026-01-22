import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column('jsonb', { nullable: true })
  meta?: any;

  @CreateDateColumn()
  createdAt: Date;
}