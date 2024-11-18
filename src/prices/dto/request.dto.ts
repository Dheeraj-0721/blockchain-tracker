import { IsNumber, Min } from 'class-validator';

export class SwapRateDto {
  @IsNumber()
  @Min(0)
  ethAmount: number;
}
