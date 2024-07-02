import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { ServerConfig } from 'src/config/server.config';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class OtpService {
  constructor(
    private readonly config: ServerConfig,
    private readonly userService: UserService,
  ) {}

  async generate2FASecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.config.getAppName(),
      secret,
    );
    await this.userService.set2FASecret(user._id.toString(), secret);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async generateQrCode(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async is2FACodeValid(twoFactorCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFactorAuthSecret,
    });
  }
}
