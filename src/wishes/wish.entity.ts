import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Offer } from '../offers/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wish {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор подарка' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Iphone 15', description: 'Название подарка' })
  @Column({ length: 250 })
  name: string;

  @ApiProperty({ example: 'https://example.com/iphone', description: 'Ссылка на подарок' })
  @Column()
  link: string;

  @ApiProperty({ example: 'https://example.com/images/iphone.jpg', description: 'Ссылка на изображение подарка' })
  @Column()
  image: string;

  @ApiProperty({ example: 99999.99, description: 'Стоимость подарка' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 1500.00, description: 'Собранная сумма' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number;

  @ApiProperty({ description: 'Владелец подарка' })
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiProperty({ example: 'Очень хочу новый Iphone', description: 'Описание подарка' })
  @Column({ length: 1024 })
  description: string;

  @ApiProperty({ description: 'Предложения по скидыванию на подарок' })
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiProperty({ example: 5, description: 'Количество копирований подарка' })
  @Column('int', { default: 0 })
  copied: number;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Дата создания' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-02T00:00:00Z', description: 'Дата обновления' })
  @UpdateDateColumn()
  updatedAt: Date;
}
