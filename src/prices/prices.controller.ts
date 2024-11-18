import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { SwapRateDto } from './dto/request.dto';
import { Cron } from '@nestjs/schedule';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('hourly/:chain')
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.pricesService.getHourlyPrices(chain);
  }

  @Get('swap-rate')
  async getSwapRate(@Query() { ethAmount }: SwapRateDto) {
    return this.pricesService.getSwapRate(ethAmount);
  }

  @Post('/:chain')
  async setPrice(@Param('chain') chain: string) {
    const address =
      chain === '0x1'
        ? process.env.ETHEREUM_ADDRESS
        : process.env.MATIC_ADDRESS;
    return this.pricesService.setPrice(chain, address);
  }

  @Cron('*/5 * * * *') // Every 5 minutes
  async updatePrices() {
    await this.pricesService.setPrice('0x1', process.env.ETHEREUM_ADDRESS);
    await this.pricesService.setPrice('0x1', process.env.MATIC_ADDRESS);
  }
}
