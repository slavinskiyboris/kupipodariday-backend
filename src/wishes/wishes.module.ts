import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { WishesService } from './wishes.service';
import {
  WishesController,
  ProtectedWishesController,
} from './wishes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
  controllers: [WishesController, ProtectedWishesController],
  exports: [WishesService],
})
export class WishesModule {}
