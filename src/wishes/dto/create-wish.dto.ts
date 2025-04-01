import { 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  IsUrl, 
  IsNumber, 
  Min
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty({ message: 'Название подарка не может быть пустым' })
  @IsString({ message: 'Название подарка должно быть строкой' })
  @MaxLength(250, { message: 'Название подарка не может быть длиннее 250 символов' })
  name: string;

  @IsNotEmpty({ message: 'Ссылка на подарок не может быть пустой' })
  @IsUrl({}, { message: 'Некорректный формат ссылки' })
  link: string;

  @IsNotEmpty({ message: 'Ссылка на изображение не может быть пустой' })
  @IsUrl({}, { message: 'Некорректный формат ссылки на изображение' })
  image: string;

  @IsNotEmpty({ message: 'Цена подарка не может быть пустой' })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(1, { message: 'Цена должна быть больше нуля' })
  price: number;

  @IsNotEmpty({ message: 'Описание подарка не может быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(1024, { message: 'Описание не может быть длиннее 1024 символов' })
  description: string;
} 