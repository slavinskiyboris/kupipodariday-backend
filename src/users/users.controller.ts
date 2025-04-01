import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HashService } from 'src/auth/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchDto } from './dto/user-search.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { User } from './user.entity';

@ApiTags('users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о пользователе',
    type: User
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get('me')
  async fetchCurrentUser(@Request() req) {
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @ApiOperation({ summary: 'Получение информации о пользователе по имени' })
  @ApiParam({ name: 'username', description: 'Имя пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о пользователе',
    type: User
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get(':username')
  async fetchUserByName(@Param('username') username: string) {
    return this.userService.getUserByQuery({ where: { username } });
  }

  @ApiOperation({ summary: 'Обновление профиля текущего пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль успешно обновлен',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 409, description: 'Данные (email, username) уже используются' })
  @Put('me')
  async updateMyProfile(@Request() req, @Body() profileChanges: UpdateUserDto) {
    await this.userService.validateUniqueFields(req.user.userId, profileChanges);

    if (profileChanges.password) {
      profileChanges.password = await this.hashService.hashPassword(
        profileChanges.password,
      );
    }

    await this.userService.editUser(req.user.userId, profileChanges);
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @ApiOperation({ summary: 'Поиск пользователей' })
  @ApiQuery({ name: 'query', description: 'Поисковый запрос' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей',
    type: [User]
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get()
  async searchAccounts(@Query() searchParams: UserSearchDto) {
    return this.userService.searchUsers(searchParams.query);
  }

  @ApiOperation({ summary: 'Обновление профиля по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Профиль успешно обновлен',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 409, description: 'Данные (email, username) уже используются' })
  @Put(':id')
  async updateUserAccount(
    @Param('id') userId: number,
    @Body() profileChanges: UpdateUserDto,
    @Request() req,
  ) {
    if (userId !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own profile');
    }

    await this.userService.validateUniqueFields(userId, profileChanges);

    if (profileChanges.password) {
      profileChanges.password = await this.hashService.hashPassword(
        profileChanges.password,
      );
    }

    await this.userService.editUser(userId, profileChanges);
    return this.userService.getUserByQuery({ where: { id: userId } });
  }

  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @Delete(':id')
  async removeAccount(@Param('id') userId: number, @Request() req) {
    if (userId !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own profile');
    }
    await this.userService.deleteUser(userId);
  }
}
