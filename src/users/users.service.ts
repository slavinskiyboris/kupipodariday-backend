import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async registerUser(userData: Partial<User>): Promise<User> {
    const existingAccount = await this.userRepo.findOne({
      where: [
        { email: userData.email },
        { username: userData.username },
      ],
    });

    if (existingAccount) {
      if (existingAccount.email === userData.email) {
        throw new ConflictException('Email is already taken');
      }
      if (existingAccount.username === userData.username) {
        throw new ConflictException('Username is already taken');
      }
    }

    const newAccount = this.userRepo.create(userData);
    return this.userRepo.save(newAccount);
  }

  async getUserByQuery(searchParams: FindOneOptions<User>): Promise<User> {
    return this.userRepo.findOne(searchParams);
  }

  async listAllUsers(searchOptions: FindManyOptions<User> = {}): Promise<User[]> {
    return this.userRepo.find(searchOptions);
  }

  async searchUsers(searchText: string): Promise<User[]> {
    return this.userRepo.find({
      where: [
        { username: Like(`%${searchText}%`) }, 
        { email: Like(`%${searchText}%`) }
      ],
    });
  }

  async editUser(userId: number, userChanges: Partial<User>): Promise<void> {
    await this.userRepo.update(userId, userChanges);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepo.delete(userId);
  }

  async validateUniqueFields(
    currentUserId: number,
    updatedFields: Partial<User>,
  ): Promise<void> {
    const existingAccount = await this.userRepo.findOne({
      where: [
        { email: updatedFields.email }, 
        { username: updatedFields.username }
      ],
    });

    if (existingAccount && existingAccount.id !== currentUserId) {
      if (existingAccount.email === updatedFields.email) {
        throw new ConflictException('Email is already taken');
      }
      if (existingAccount.username === updatedFields.username) {
        throw new ConflictException('Username is already taken');
      }
    }
  }
}
