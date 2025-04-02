import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
  Post,
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
  ApiBearerAuth,
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
    description: 'Профиль успешно обновлен',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get('me')
  async fetchCurrentUser(@Request() req) {
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @ApiOperation({ summary: 'Получение списка подарков пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список подарков пользователя',
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get('me/wishes')
  async getCurrentUserWishes(@Request() req) {
    const user = await this.userService.getUserByQuery({
      where: { id: req.user.userId },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  @ApiOperation({ summary: 'Получение информации о пользователе по имени' })
  @ApiParam({ name: 'username', description: 'Имя пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get(':username')
  async fetchUserByName(@Param('username') username: string) {
    return this.userService.getUserByQuery({ where: { username } });
  }

  @ApiOperation({ summary: 'Получение списка подарков по имени пользователя' })
  @ApiParam({ name: 'username', description: 'Имя пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список подарков пользователя',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.userService.getUserByQuery({
      where: { username },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  @ApiOperation({ summary: 'Обновление профиля текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно обновлен',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({
    status: 409,
    description: 'Данные (email, username) уже используются',
  })
  @Patch('me')
  async updateMyProfile(@Request() req, @Body() profileChanges: UpdateUserDto) {
    await this.userService.validateUniqueFields(
      req.user.userId,
      profileChanges,
    );

    if (profileChanges.password) {
      profileChanges.password = await this.hashService.hashPassword(
        profileChanges.password,
      );
    }

    await this.userService.editUser(req.user.userId, profileChanges);
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @ApiOperation({ summary: 'Поиск пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @Post('find')
  async searchAccounts(@Body() searchParams: UserSearchDto) {
    return this.userService.searchUsers(searchParams.query);
  }
}
