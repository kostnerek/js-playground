import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-azure-ad-oauth2';
import { ConfigService } from '@nestjs/config';
import { ADConfig } from 'src/config/ad.config';
import { EnvironmentVariables } from 'src/config/env.variables';
import { decode } from 'jsonwebtoken';

@Injectable()
export class ADStrategy extends PassportStrategy(Strategy, 'azure_ad_oauth2') {
  constructor() {
    const config = new ConfigService<EnvironmentVariables>();
    const adConfig = new ADConfig(config);
    super({
      clientID: adConfig.getAppId(),
      clientSecret: adConfig.getClientSecret(),
      callbackURL: adConfig.getRedirectUri(),
      tenant: adConfig.getTenantUrl(),
    });
  }

  async validate(accessToken: string) {
    const adProf = decode(accessToken) as any;
    return {
      firstName: adProf.name.split(' ')[0],
      lastName: adProf.name.split(' ')[1],
      email: adProf.email,
    };
  }
}
