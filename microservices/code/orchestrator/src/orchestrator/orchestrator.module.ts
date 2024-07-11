import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { Channel, connect } from 'amqp-connection-manager';
import {
  ORCHESTRATOR_QUEUES,
  allQueues,
  inQueues,
  outQueues,
} from 'src/common/queues';
import { QueueMessage } from 'src/common/interfaces/queueMessage.interface';

@Module({
  imports: [],
  providers: [OrchestratorService, Logger],
})
export class OrchestratorModule implements OnApplicationBootstrap {
  queueConfig = {
    connectionData: {
      url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
      nameIn: ORCHESTRATOR_QUEUES.ORCHESTRATOR_IN,
      nameOut: ORCHESTRATOR_QUEUES.ORCHESTRATOR_OUT,
    },
    outQueues,
    inQueues,
  };
  constructor(private readonly orchestratorService: OrchestratorService) {}

  async onApplicationBootstrap() {
    const connection = connect(this.queueConfig.connectionData.url, {
      connectionOptions: {
        clientProperties: {
          connection_name: this.queueConfig.connectionData.nameIn,
        },
      },
    });

    const channelPromises = allQueues.map(async (queue) => {
      console.log(`Creating channel ${queue}`);
      const channel = connection.createChannel({
        name: queue,
        json: true,
        setup: (channel: Channel) => this.setupQueue(channel, queue),
      });
      await channel.waitForConnect();
      console.log(`Channel ${queue} connected`)
    });
    await Promise.all(channelPromises);
  }

  async setupQueue(channel: Channel, queue: string) {
    channel.assertQueue(queue, { durable: true });
    if (queue.endsWith('_IN')) {
      return;
    }
    channel.consume(queue, (msg) => {
      if (msg) {
        const parsedMessage = JSON.parse(
          msg.content.toString(),
        ) as QueueMessage;
        this.orchestratorService.handleRedirection(
          queue,
          parsedMessage,
          channel,
        );
        channel.ack(msg);
      }
    });
  }
}
