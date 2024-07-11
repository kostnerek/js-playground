import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppHandler } from './app.handler';

@Module({
  imports: [],
  controllers: [AppController, AppHandler],
  providers: [AppService, ],
})
export class AppModule {}
