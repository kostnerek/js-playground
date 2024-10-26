import { Injectable } from '@nestjs/common';
import { GoogleConfig } from '../../config/google.config';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config/env.variables';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private googleConfig: GoogleConfig;
  constructor() {
    const config = new ConfigService<EnvironmentVariables>();
    const googleConfig = new GoogleConfig(config);
    super({
      clientID: googleConfig.getClientId(),
      clientSecret: googleConfig.getClientSecret(),
      callbackURL: googleConfig.getRedirectUri(),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
    this.googleConfig = googleConfig;
  }

  async validate(
    _: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails } = profile;
    const { given_name, family_name } = profile._json;
    const user = {
      provider: 'google',
      providerId: id,
      name: given_name,
      surname: family_name,
      email: emails?.[0].value ?? '',
    };
    done(null, user);
    return user;
  }

  public async getUserDataWithAccessToken(accessToken: string) {
    const userinfoResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (userinfoResponse.status === 200) {
      const userInfo = userinfoResponse.data;
      return userInfo;
    } else {
      console.error(
        `Error: ${userinfoResponse.status} - ${userinfoResponse.statusText}`,
      );
    }
    return userinfoResponse;
  }

  public async getUserDataWithCode(code: any) {
    return await axios
      .post('https://oauth2.googleapis.com/token', {
        client_id: this.googleConfig.getClientId(),
        client_secret: this.googleConfig.getClientSecret(),
        redirect_uri: this.googleConfig.getRedirectUri(),
        code: code,
        grant_type: 'authorization_code',
      })
      .then(async (response) => {
        return await this.getUserDataWithAccessToken(
          response.data.access_token,
        );
      })
      .catch((error) => {
        console.error('Error:', error.response.data.error_description);
      });
  }
}
