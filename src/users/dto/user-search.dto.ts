import { IsString, IsNotEmpty } from 'class-validator';

export class UserSearchDto {
  @IsNotEmpty({ message: 'Поисковый запрос не может быть пустым' })
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  query: string;
} 