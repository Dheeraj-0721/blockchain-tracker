import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { firstValueFrom, map, catchError } from 'rxjs';
import Moralis from 'moralis';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async getPrice(chain: string) {
    const response = await firstValueFrom(
      this.httpService
        .get(process.env.COINBASE_API_URL)
        .pipe(
          map(async (res) => {
            return res.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log(e);
            throw new ForbiddenException('API not available');
          }),
        ),
    );
    return response;
  }

  async getPriceBySymbols(chain: string, address: string) {
    try {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });

      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: chain,
        include: 'percent_change',
        address: address,
      });

      console.log(response.raw);
      return response.raw;
    } catch (e) {
      console.error(e);
    }
  }
}
