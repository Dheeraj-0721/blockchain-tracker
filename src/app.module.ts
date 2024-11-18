import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricesModule } from './prices/prices.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [PricesModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
