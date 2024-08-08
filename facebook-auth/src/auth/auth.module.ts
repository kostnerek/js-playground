import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { ConfigModule } from '../config/config.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TokenService } from './token.service';
import { TokenSchema, Token } from './schemas/token.schema';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from 'src/config/auth.config';
import { FacebookStrategy } from './strategy/facebook.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
        ConfigModule,
        UserModule,
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
    providers: [AuthService, JwtStrategy, TokenService, FacebookStrategy],
    exports: [AuthService],
})
export class AuthModule {}