import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from 'src/utils/api.service';
import { AlertsService } from 'src/alerts/alerts.service';
import { EmailService } from 'src/utils/email.service';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule.register({ timeout: 10000, maxRedirects: 5 }),
    ScheduleModule.forRoot(),
  ],
  controllers: [PricesController],
  providers: [
    PricesService,
    PrismaService,
    ApiService,
    AlertsService,
    EmailService,
    ConfigService,
  ],
})
export class PricesModule {}
