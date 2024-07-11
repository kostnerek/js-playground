import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'calculator_queue',
      queueOptions: {
        durable: true
      }
    }
  })

  await app.startAllMicroservices()
  await app.listen(3000);
  console.log("Server started at 3000")
}
bootstrap();
