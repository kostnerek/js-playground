import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { EnvironmentVariables } from "src/config/env.variables";
import { FacebookConfig } from "src/config/facebook.config";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    const config = new ConfigService<EnvironmentVariables>();
    const facebookConfig = new FacebookConfig(config);
    super({
      clientID: facebookConfig.getAppId(),
      clientSecret: facebookConfig.getAppSecret(),
      callbackURL: facebookConfig.getRedirectUri(),
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}