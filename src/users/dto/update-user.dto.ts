import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsEmail, 
  IsOptional 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Имя пользователя', required: false })
  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MaxLength(30, { message: 'Имя пользователя не может быть длиннее 30 символов' })
  username?: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя', required: false })
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать как минимум 6 символов' })
  password?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({ example: 'Я люблю дарить подарки', description: 'Информация о пользователе', required: false })
  @IsOptional()
  @IsString({ message: 'Информация о пользователе должна быть строкой' })
  @MaxLength(200, { message: 'Информация о пользователе не может быть длиннее 200 символов' })
  about?: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300', description: 'Ссылка на аватар', required: false })
  @IsOptional()
  @IsString({ message: 'URL аватара должен быть строкой' })
  avatar?: string;
} 