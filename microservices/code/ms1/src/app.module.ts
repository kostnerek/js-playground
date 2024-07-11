import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculatorModule } from './calculator/calculator.module';

@Module({
  imports: [
    CalculatorModule,
    /* ClientsModule.register([
      {name: 'CALCULATOR_SERVICE', transport: Transport.RMQ}
    ]) */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
