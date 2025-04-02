import {
  IsString,
  MaxLength,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @IsString({ message: 'Название подарка должно быть строкой' })
  @MaxLength(250, {
    message: 'Название подарка не может быть длиннее 250 символов',
  })
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Некорректный формат ссылки' })
  link?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Некорректный формат ссылки на изображение' })
  image?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(1, { message: 'Цена должна быть больше нуля' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(1024, { message: 'Описание не может быть длиннее 1024 символов' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @Min(0, { message: 'Сумма не может быть отрицательной' })
  raised?: number;
}
