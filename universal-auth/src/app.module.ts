import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseConfig } from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfig } from './config/throttler.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: DatabaseConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ThrottlerConfig,
    }),
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, 
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ],
})
export class AppModule {}
