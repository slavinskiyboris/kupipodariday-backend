import { 
  IsNotEmpty, 
  IsNumber, 
  Min, 
  IsBoolean, 
  IsOptional 
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty({ message: 'Сумма взноса не может быть пустой' })
  @IsNumber({}, { message: 'Сумма взноса должна быть числом' })
  @Min(1, { message: 'Сумма взноса должна быть больше нуля' })
  amount: number;

  @IsNotEmpty({ message: 'ID желания не может быть пустым' })
  @IsNumber({}, { message: 'ID желания должен быть числом' })
  item: number;

  @IsOptional()
  @IsBoolean({ message: 'Скрытие имени должно быть логическим значением' })
  hidden?: boolean;
} 