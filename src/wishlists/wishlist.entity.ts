import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор списка подарков' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'День рождения', description: 'Название списка подарков' })
  @Column({ length: 250 })
  name: string;

  @ApiProperty({ example: 'Список подарков на мой день рождения', description: 'Описание списка подарков', required: false })
  @Column({ length: 1500, nullable: true })
  description: string;

  @ApiProperty({ example: 'https://example.com/images/birthday.jpg', description: 'Ссылка на изображение', required: false })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ description: 'Подарки в списке' })
  @ManyToMany(() => Wish, { lazy: true })
  @JoinTable()
  items: Wish[];

  @ApiProperty({ description: 'Владелец списка подарков' })
  @ManyToOne(() => User, (user) => user.wishlists, { lazy: true })
  owner: User;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;
}
