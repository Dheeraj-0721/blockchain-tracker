import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AlertsService } from '../alerts/alerts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiService } from 'src/utils/api.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PricesService {
  constructor(
    private prisma: PrismaService,
    private apiService: ApiService,
    private alertsService: AlertsService,
  ) {}

  async setPrice(chain: string, address: string) {
    try {
      const prices = await this.apiService.getPriceBySymbols(chain, address);
      console.log('prices::::', prices);

      await this.prisma.price.create({
        data: { chain, price: prices.usdPrice, currency: prices.tokenSymbol, priceIn: 'USD' },
      });
      await this.alertsService.checkAndSendAlerts(chain, prices.usdPrice);
    } catch (error) {
      throw error;
    }
  }

  async getHourlyPrices(chain: string) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch all prices for the chain within the last 24 hours
    const prices = await this.prisma.price.findMany({
      where: {
        chain,
        createdAt: {
          gte: oneDayAgo, // Greater than or equal to one day ago
        },
      },
      orderBy: {
        createdAt: 'asc', // Order by createdAt to process chronologically
      },
    });

    // Group prices by hour
    const hourlyPrices = prices.reduce((acc, price) => {
      const hourKey = price.createdAt.toISOString().substring(0, 13); // e.g., "2024-11-18T14"
      if (!acc[hourKey]) {
        acc[hourKey] = {
          hour: hourKey,
          prices: [],
        };
      }
      acc[hourKey].prices.push(price.price);
      return acc;
    }, {});

    // Calculate the average price for each hour
    return Object.values(hourlyPrices).map((group: any) => ({
      hour: group.hour,
      averagePrice: (
        group.prices.reduce((sum: number, price: number) => sum + price, 0) /
        group.prices.length
      ).toFixed(2), // Format to 2 decimal places
    }));
  }

  async getSwapRate(ethAmount: number) {
    try {
      const ethPrice = await this.apiService.getPrice('ethereum');
      const btcPrice = await this.apiService.getPrice('bitcoin');
      const btcAmount = (ethAmount * ethPrice) / btcPrice;
      const fee = ethAmount * 0.03;

      return {
        btcAmount,
        fee: { eth: fee, dollar: fee * ethPrice },
      };
    } catch (error) {
      throw error;
    }
  }
}
