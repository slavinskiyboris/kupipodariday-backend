import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSearchDto {
  @ApiProperty({
    example: 'john',
    description: 'Поисковый запрос для поиска пользователей',
  })
  @IsNotEmpty({ message: 'Поисковый запрос не может быть пустым' })
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  query: string;
}
