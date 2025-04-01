import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Wish } from './wish.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepo: Repository<Wish>,
  ) {}

  async createWish(wishData: Partial<Wish>): Promise<Wish> {
    const createdWish = this.wishRepo.create(wishData);
    return this.wishRepo.save(createdWish);
  }

  async getWishById(searchParams: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishRepo.findOne(searchParams);
  }

  async getAllWishes(searchParams: FindManyOptions<Wish> = {}): Promise<Wish[]> {
    return this.wishRepo.find(searchParams);
  }

  async modifyWish(wishId: number, changes: Partial<Wish>): Promise<void> {
    await this.wishRepo.update(wishId, changes);
  }

  async deleteWish(wishId: number): Promise<void> {
    await this.wishRepo.delete(wishId);
  }

  async getRecentWishes(): Promise<Wish[]> {
    return this.wishRepo.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return this.wishRepo.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async duplicateWish(wishId: number, userId: number): Promise<Wish> {
    const originalWish = await this.wishRepo.findOne({
      where: { id: wishId },
      relations: ['owner', 'offers'],
    });
    if (!originalWish) {
      throw new Error('Wish not found');
    }

    const duplicatedWish = this.wishRepo.create({
      name: originalWish.name,
      link: originalWish.link,
      image: originalWish.image,
      price: originalWish.price,
      description: originalWish.description,
      owner: { id: userId } as User,
      copied: 0,
    });

    originalWish.copied += 1;
    await this.wishRepo.save(originalWish);

    return this.wishRepo.save(duplicatedWish);
  }
}
