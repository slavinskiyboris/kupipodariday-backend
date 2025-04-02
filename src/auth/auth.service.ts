import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { User } from '../users/user.entity';

interface UserCredentials {
  username: string;
  password: string;
  email: string;
  about?: string;
  avatar?: string;
}

interface JwtPayload {
  username: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private cryptoService: HashService,
  ) {}

  async verifyCredentials(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const userAccount = await this.userService.getUserByQuery({
      where: { username },
    });
    if (
      userAccount &&
      (await this.cryptoService.comparePassword(password, userAccount.password))
    ) {
      const { ...userDetails } = userAccount;
      return userDetails;
    }
    return null;
  }

  async authenticateUser(user: Omit<User, 'password'>) {
    const tokenPayload: JwtPayload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(tokenPayload),
    };
  }

  async createAccount(accountData: UserCredentials) {
    accountData.password = await this.cryptoService.hashPassword(
      accountData.password,
    );
    return this.userService.registerUser(accountData);
  }
}
