import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlertDto } from './dto/request.dto';
import { EmailService } from 'src/utils/email.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto) {
    try {
      return this.prisma.alert.create({
        data: createAlertDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async checkAndSendAlerts(chain: string, price: number) {
    try {
      const alerts = await this.prisma.alert.findMany({
        where: { chain, targetPrice: { lte: price }, triggered: false },
      });

      for (const alert of alerts) {
        // Send email
        await this.emailService.sendEmail({
          to_user: alert.email,
          subject: `Price Alert for ${alert.chain}`,
          data: `The price of ${alert.chain} has reached $${price}.`,
        });

        // Mark alert as triggered
        await this.prisma.alert.update({
          where: { id: alert.id },
          data: { triggered: true },
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
