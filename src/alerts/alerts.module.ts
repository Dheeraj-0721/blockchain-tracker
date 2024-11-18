import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/utils/email.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule.register({ timeout: 10000, maxRedirects: 5 })],
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService, EmailService, ConfigService],
})
export class AlertsModule {}
