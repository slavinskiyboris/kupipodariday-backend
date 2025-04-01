import { 
  IsString, 
  MinLength, 
  MaxLength, 
  IsEmail, 
  IsOptional 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MaxLength(30, { message: 'Имя пользователя не может быть длиннее 30 символов' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать как минимум 6 символов' })
  password?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Информация о пользователе должна быть строкой' })
  @MaxLength(200, { message: 'Информация о пользователе не может быть длиннее 200 символов' })
  about?: string;

  @IsOptional()
  @IsString({ message: 'URL аватара должен быть строкой' })
  avatar?: string;
} 