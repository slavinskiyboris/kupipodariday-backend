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
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/user.entity';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { Wish } from './wish.entity';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  @ApiOperation({ summary: 'Получение последних 40 подарков' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список последних подарков',
    type: [Wish]
  })
  @Get('latest')
  async fetchLatestWishes() {
    return this.wishService.getRecentWishes();
  }

  @ApiOperation({ summary: 'Получение популярных подарков' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список популярных подарков',
    type: [Wish]
  })
  @Get('popular')
  async fetchTrendingWishes() {
    return this.wishService.getTopWishes();
  }
}

@ApiTags('wishes')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class ProtectedWishesController {
  constructor(private readonly wishService: WishesService) {}

  @ApiOperation({ summary: 'Создание подарка' })
  @ApiResponse({ 
    status: 201, 
    description: 'Подарок успешно создан',
    type: Wish
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Post()
  async addNewWish(@Body() wishItem: CreateWishDto, @Request() req) {
    const wishData = {
      ...wishItem,
      owner: { id: req.user.userId } as User
    };
    return this.wishService.createWish(wishData);
  }

  @ApiOperation({ summary: 'Получение информации о подарке по ID' })
  @ApiParam({ name: 'id', description: 'ID подарка' })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о подарке',
    type: Wish
  })
  @ApiResponse({ status: 404, description: 'Подарок не найден' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get(':id')
  async fetchWishDetails(@Param('id') id: number) {
    return this.wishService.getWishById({ where: { id } });
  }

  @ApiOperation({ summary: 'Обновление подарка' })
  @ApiParam({ name: 'id', description: 'ID подарка' })
  @ApiResponse({ 
    status: 200, 
    description: 'Подарок успешно обновлен',
    type: Wish
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Подарок не найден' })
  @Put(':id')
  async editWishDetails(
    @Param('id') wishId: number,
    @Body() wishUpdates: UpdateWishDto,
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

  @ApiOperation({ summary: 'Удаление подарка' })
  @ApiParam({ name: 'id', description: 'ID подарка' })
  @ApiResponse({ status: 200, description: 'Подарок удален' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Подарок не найден' })
  @Delete(':id')
  async removeWish(@Param('id') wishId: number, @Request() req) {
    const targetWish = await this.wishService.getWishById({ where: { id: wishId } });
    if (targetWish.owner.id !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own wishes');
    }
    await this.wishService.deleteWish(wishId);
  }

  @ApiOperation({ summary: 'Получение всех подарков' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список всех подарков',
    type: [Wish]
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get()
  async fetchAllWishes() {
    return this.wishService.getAllWishes();
  }

  @ApiOperation({ summary: 'Копирование подарка в свой список' })
  @ApiParam({ name: 'id', description: 'ID подарка' })
  @ApiResponse({ 
    status: 201, 
    description: 'Подарок успешно скопирован',
    type: Wish
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Подарок не найден' })
  @Post(':id/copy')
  async cloneWish(@Param('id') wishId: number, @Request() req) {
    return this.wishService.duplicateWish(wishId, req.user.userId);
  }
}
