import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailNotificationService } from 'src/notifications/mail-notifications.service';
import { UserService } from 'src/user/user.service';
import { MagicLinkType } from './enums/magic-link.enum';
import { TokenService } from './token.service';
import { verify, decode } from 'jsonwebtoken';
import { AuthConfig } from 'src/config/auth.config';
import { ITokenPayload } from './interfaces/token.interface';
import { match } from 'ts-pattern';
import { TokenType } from './types/tokens.types';
import { UserStatus } from 'src/user/enums/user-status.enum';

@Injectable()
export class MagicService {
  constructor(
    private readonly mailer: MailNotificationService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly config: AuthConfig,
  ) {}

  async sendMagicLink(email: string, type: MagicLinkType) {
    const magicToken = await this.tokenService.generateMagicLinkToken(
      email,
      type,
      'http://localhost:3000/auth/register/confirm',
    );
    const text = `Link <a href="http://localhost:3000/auth/magic?token=${magicToken}">here</a> to access app.`;
    return this.mailer.sendMail(email, type, text);
  }

  async register(email: string) {
    await this.sendMagicLink(email, MagicLinkType.REGISTER);
    return { message: 'Check your email' };
  }

  async login(email: string) {
    await this.sendMagicLink(email, MagicLinkType.LOGIN);
    return { message: 'Check your email' };
  }

  //utils

  validate(token: string): ITokenPayload {
    verify(token, this.config.getMagicLinkSecret(), (err, decoded) => {
      if (err) {
        throw new UnauthorizedException('Expired or malformed token');
      }
      return decoded;
    });
    const decoded = decode(token) as ITokenPayload;
    if (decoded.tokenType !== TokenType.MagicLink) {
      throw new UnauthorizedException('Invalid token type');
    }
    return decoded;
  }

  async callback(token: string) {
    const payload = this.validate(token);
    return await match(payload.magicType as MagicLinkType)
      .with(MagicLinkType.LOGIN, async () => {
        const user = await this.userService.getOneByEmail(payload.email);
        return this.tokenService.generateTokens(user._id.toString(), user.type);
      })
      .with(MagicLinkType.REGISTER, async () => {
        if (await this.userService.findOneByEmail(payload.email)) {
          throw new Error('User already exists');
        }
        const user = await this.userService.create({
          email: payload.email,
          status: UserStatus.ACTIVE,
        });
        return this.tokenService.generateTokens(user._id.toString(), user.type);
      })
      .exhaustive();
  }
}
