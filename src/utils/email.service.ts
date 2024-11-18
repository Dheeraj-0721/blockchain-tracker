import { Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail({ to_user, subject, data }) {
    try {
      SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: to_user.email,
        from: process.env.ADMIN_EMAIL,
        subject: subject,
        html: data,
      };
      return await SendGrid.send(msg);
    } catch (error) {
      throw error;
    }
  }
}
