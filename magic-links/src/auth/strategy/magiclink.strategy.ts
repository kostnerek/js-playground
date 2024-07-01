// magiclogin.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { MailNotificationService } from 'src/notifications/mail-notifications.service';
import { AuthConfig } from 'src/config/auth.config';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(
    private authService: AuthService,
    private readonly mailer: MailNotificationService,
    private readonly config: AuthConfig,
  ) {
    super({
      secret: 'secret', //config.getMagicLinkSecret(), // get this from env vars
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: 'http://localhost:3000/auth/login/callback',
      sendMagicLink: async (destination: string, href: string) => {
        Logger.log('sendMagicLink');
        // send email using an arrow function to ensure correct 'this' context
        await this.mailer.sendMail(
          destination,
          'Magic Login Link',
          `Click on the link to log in: ${href}`,
        );
        this.logger.debug(`sending email to ${destination} with link ${href}`);
      },
      verify: async (payload, callback) => {
        const user = await this.validate(payload);
        callback(null, user);
      },
    });
  }

  async validate(payload: { destination: string }) {
    const user = await this.authService.validateUser(payload.destination);
    return user;
  }
}
