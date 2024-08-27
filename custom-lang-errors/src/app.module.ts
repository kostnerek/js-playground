import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LangMiddleware } from 'common/decorators/user-lang.decorator';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'common/filters/catch-all.filter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LangMiddleware).forRoutes('*');
  }
}
