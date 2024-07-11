import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private client?: IAmqpConnectionManager;
  private channel?: ChannelWrapper;
  private channelName = 'MS1_IN';

  @Get()
  getHello(): string {
    this.client = connect('amqp://rabbitmq:5672', {
      connectionOptions: {
        clientProperties: { connection_name: this.channelName },
      },
    });
    this.channel = this.client.createChannel({
      name: this.channelName,
      json: true,
      setup: (channel) => {
        channel.assertQueue(this.channelName, { durable: true })
        channel.consume(this.channelName, (msg) => {
          if (msg) {
            const parsedMessage = JSON.parse(
              msg.content.toString(),
            )
            console.log(parsedMessage)
            channel.ack(msg);
          }
        });
      }
    });

    const outQueue = 'MS1_OUT'

      
    console.log(`Sending message to ${outQueue}`);
    this.channel.sendToQueue(outQueue, {
      messageName: 'MS1_HELLO_WORLD',
      message: 'Hello from MS1',
    });

    
    return this.appService.getHello();
  }
}