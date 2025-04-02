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
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Wishlist } from './wishlist.entity';

@ApiTags('wishlists')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({ summary: 'Создание списка подарков' })
  @ApiResponse({
    status: 201,
    description: 'Список подарков успешно создан',
    type: Wishlist,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    return this.wishlistsService.create({
      ...createWishlistDto,
      owner: req.user.userId,
    });
  }

  @ApiOperation({ summary: 'Получение всех списков подарков' })
  @ApiResponse({
    status: 200,
    description: 'Список всех списков подарков',
    type: [Wishlist],
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get()
  async findAll() {
    return this.wishlistsService.findAll();
  }

  @ApiOperation({ summary: 'Получение информации о списке подарков по ID' })
  @ApiParam({ name: 'id', description: 'ID списка подарков' })
  @ApiResponse({
    status: 200,
    description: 'Информация о списке подарков',
    type: Wishlist,
  })
  @ApiResponse({ status: 404, description: 'Список подарков не найден' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  @ApiOperation({ summary: 'Обновление списка подарков' })
  @ApiParam({ name: 'id', description: 'ID списка подарков' })
  @ApiResponse({
    status: 200,
    description: 'Список подарков успешно обновлен',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Список подарков не найден' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Request() req,
  ) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('You can only update your own wishlists');
    }
    return this.wishlistsService.updateOne(Number(id), updateWishlistDto);
  }

  @ApiOperation({ summary: 'Удаление списка подарков' })
  @ApiParam({ name: 'id', description: 'ID списка подарков' })
  @ApiResponse({ status: 200, description: 'Список подарков удален' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Список подарков не найден' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const wishlist = await this.wishlistsService.findOne(Number(id));
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    if (wishlist.owner.id !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own wishlists');
    }
    await this.wishlistsService.removeOne(Number(id));
    return { message: 'Wishlist deleted successfully' };
  }
}
