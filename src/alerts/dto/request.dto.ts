import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  chain: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  targetPrice: number;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
