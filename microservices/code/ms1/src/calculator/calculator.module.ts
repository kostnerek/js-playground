import { Module } from "@nestjs/common";
import { CalculatorController } from "./calculator.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
          {name: 'CALCULATOR_SERVICE', transport: Transport.RMQ, options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'calculator_queue',
            queueOptions: {
              durable: true,
            }
          }}
        ])
    ],
    controllers: [CalculatorController],
    providers: []
}) 
export class CalculatorModule {}