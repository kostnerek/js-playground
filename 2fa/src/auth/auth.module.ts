import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthConfig } from '../config/auth.config';
import { ConfigModule } from '../config/config.module';
import { TokenService } from './token.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { OtpService } from './otp.service';
@Module({
  imports: [
    ConfigModule,
    UserModule,

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
  providers: [TokenService, AuthService, JwtStrategy, OtpService],
})
export class AuthModule {}
