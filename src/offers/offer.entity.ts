import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор предложения',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Пользователь, сделавший предложение', type: () => User })
  @ManyToOne(() => User, (user) => user.offers, { lazy: true, eager: false })
  user: User;

  @ApiProperty({ description: 'Подарок, на который скидываются', type: () => Wish })
  @ManyToOne(() => Wish, (wish) => wish.offers, { lazy: true, eager: false })
  item: Wish;

  @ApiProperty({ example: 1000.0, description: 'Сумма взноса' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: false, description: 'Скрыть ли имя дарителя' })
  @Column({ default: false })
  hidden: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Дата создания',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Дата обновления',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
