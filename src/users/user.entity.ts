import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../wishes/wish.entity';
import { Offer } from '../offers/offer.entity';
import { Wishlist } from '../wishlists/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Имя пользователя' })
  @Column({ unique: true, length: 30 })
  username: string;

  @ApiProperty({
    example: 'Я люблю дарить подарки',
    description: 'Информация о пользователе',
  })
  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  about: string;

  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    description: 'Ссылка на аватар',
  })
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Хэшированный пароль' })
  @Column()
  password: string;

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

  @ApiProperty({ description: 'Подарки пользователя', type: () => [Wish] })
  @OneToMany(() => Wish, (wish) => wish.owner, { lazy: true })
  wishes: Wish[];

  @ApiProperty({ description: 'Предложения пользователя', type: () => [Offer] })
  @OneToMany(() => Offer, (offer) => offer.user, { lazy: true })
  offers: Offer[];

  @ApiProperty({ description: 'Списки подарков пользователя', type: () => [Wishlist] })
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, { lazy: true })
  wishlists: Wishlist[];
}
