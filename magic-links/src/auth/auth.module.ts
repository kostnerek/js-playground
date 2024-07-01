import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthConfig } from '../config/auth.config';
import { ConfigModule } from '../config/config.module';
import { Token, TokenSchema } from './token.schema';
import { TokenService } from './token.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLoginStrategy } from './strategy/magiclink.strategy';
import { MagicService } from './magic.service';
@Module({
  imports: [
    ConfigModule,
    UserModule,
    NotificationsModule,

    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: AuthConfig) => ({
        secret: config.getJwtSecret(),
        signOptions: {
          expiresIn: `${config.getTokenExpirationTime()}h`,
        },
      }),
      inject: [AuthConfig],
    }),
  ],
  controllers: [AuthController],
  providers: [
    NotificationsModule,
    TokenService,
    AuthService,
    MagicLoginStrategy,
    MagicService,
  ],
})
export class AuthModule {}
