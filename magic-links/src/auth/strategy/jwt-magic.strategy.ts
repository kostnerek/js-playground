// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthConfig } from 'src/config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-magic') {
  constructor(
    private authService: AuthService,
    private readonly config: AuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getMagicLinkSecret(),
    });
  }

  async validate(payload: any) {
    const user = this.authService.validateUser(payload.email);
    return user;
  }
}
