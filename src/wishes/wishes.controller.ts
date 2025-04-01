import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addNewWish(@Body() wishItem, @Request() req) {
    wishItem.owner = req.user.userId;
    return this.wishService.createWish(wishItem);
  }

  @Get('latest')
  async fetchLatestWishes() {
    return this.wishService.getRecentWishes();
  }

  @Get('popular')
  async fetchTrendingWishes() {
    return this.wishService.getTopWishes();
  }

  @Get(':id')
  async fetchWishDetails(@Param('id') id: number) {
    return this.wishService.getWishById({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editWishDetails(
    @Param('id') wishId: number,
    @Body() wishUpdates,
    @Request() req,
  ) {
    const targetWish = await this.wishService.getWishById({ where: { id: wishId } });
    if (targetWish.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own wishes');
    }
    if (targetWish.offers.length > 0 && wishUpdates.price) {
      throw new ForbiddenException(
        'Cannot change price if there are already offers',
      );
    }
    if (wishUpdates.raised) {
      delete wishUpdates.raised;
    }
    await this.wishService.modifyWish(wishId, wishUpdates);
    return this.wishService.getWishById({ where: { id: wishId } });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeWish(@Param('id') wishId: number, @Request() req) {
    const targetWish = await this.wishService.getWishById({ where: { id: wishId } });
    if (targetWish.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own wishes');
    }
    await this.wishService.deleteWish(wishId);
  }

  @Get()
  async fetchAllWishes() {
    return this.wishService.getAllWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async cloneWish(@Param('id') wishId: number, @Request() req) {
    return this.wishService.duplicateWish(wishId, req.user.userId);
  }
}
