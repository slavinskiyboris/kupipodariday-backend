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
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async fetchCurrentUser(@Request() req) {
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @Get(':username')
  async fetchUserByName(@Param('username') username: string) {
    return this.userService.getUserByQuery({ where: { username } });
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyProfile(@Request() req, @Body() profileChanges: Partial<User>) {
    await this.userService.validateUniqueFields(req.user.userId, profileChanges);

    if (profileChanges.password) {
      profileChanges.password = await this.hashService.hashPassword(
        profileChanges.password,
      );
    }

    await this.userService.editUser(req.user.userId, profileChanges);
    return this.userService.getUserByQuery({ where: { id: req.user.userId } });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async searchAccounts(@Query('query') searchTerm: string) {
    return this.userService.searchUsers(searchTerm);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserAccount(
    @Param('id') userId: number,
    @Body() profileChanges: Partial<User>,
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeAccount(@Param('id') userId: number, @Request() req) {
    if (userId !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own profile');
    }
    await this.userService.deleteUser(userId);
  }
}
