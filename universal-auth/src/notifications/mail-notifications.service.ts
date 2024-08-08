import { Injectable, Logger } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import { MailConfig } from 'src/config/mail.config';

@Injectable()
export class MailNotificationService {
  private client = new Mailgun(FormData).client({
    username: 'api',
    key: this.config.getApiKey(),
  });
  constructor(private readonly config: MailConfig) {}

  async sendUserVerifyAccountEmail(email: string, url: string) {
    const subject = 'Verify your account';
    const text = `Please click the following link to verify your account: ${url}`;
    await this.sendMail(email, subject, text);
  }

  async sendUserResetPasswordEmail(email: string, url: string) {
    const subject = 'Reset your password';
    const text = `Please click the following link to reset your password: ${url}`;
    await this.sendMail(email, subject, text);
  }


  private async sendMail(to: string, subject: string, text: string) {
    const mgHost = this.config.getMailHost();
    Logger.log(`Sending email to ${to}`);
    await this.client.messages
      .create(mgHost, {
        from: `UniversalAuth <mailgun@${mgHost}>`,
        to,
        subject,
        html: text,
      })
      .then((res) => {
        Logger.log(res);
      })
      .catch((err) => {
        Logger.error(err);
      });
  }
}
