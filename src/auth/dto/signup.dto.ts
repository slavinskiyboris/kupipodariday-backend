import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @MaxLength(30, {
    message: 'Имя пользователя не может быть длиннее 30 символов',
  })
  username: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать как минимум 6 символов' })
  password: string;

  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Информация о пользователе должна быть строкой' })
  @MaxLength(200, {
    message: 'Информация о пользователе не может быть длиннее 200 символов',
  })
  about?: string;

  @IsOptional()
  @IsString({ message: 'URL аватара должен быть строкой' })
  avatar?: string;
}
