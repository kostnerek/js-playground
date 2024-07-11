// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module'; // Update the path to your main application module

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'], // RabbitMQ server URL
        queue: 'ORCHESTRATOR_IN',
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
}
bootstrap();
