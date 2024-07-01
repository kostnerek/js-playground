import { Injectable, Logger } from '@nestjs/common';
import { MailConfig } from 'src/config/mail.config';

import Mailgun from 'mailgun.js';
@Injectable()
export class MailNotificationService {
  constructor(private readonly config: MailConfig) {}
  private client = new Mailgun(FormData).client({
    username: 'api',
    key: this.config.getApiKey(),
  });

  async sendMail(to: string, subject: string, text: string) {
    const mgHost = this.config.getMailHost();

    await this.client.messages
      .create(mgHost, {
        from: `MagicLinks <mailgun@${mgHost}>`,
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
