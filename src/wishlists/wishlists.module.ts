import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './wishlist.entity';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { Wish } from '../wishes/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish]), UsersModule, WishesModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
