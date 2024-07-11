// orchestrator.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Channel } from 'amqplib';
import { QueueMessage } from 'src/common/interfaces/queueMessage.interface';
import { REDIRECTION_RULES } from 'src/common/redirectionRules';

@Injectable()
export class OrchestratorService {
  constructor(private readonly logger: Logger) {}

  private getQueueOut(messageName: string) {
    return REDIRECTION_RULES[messageName].queues ?? [];
  }
  async handleRedirection(
    queueName: string,
    message: QueueMessage,
    channel: Channel,
  ) {
    this.logger.log(
      `Received message from ${queueName}: ${JSON.stringify(message)}`,
    );
    const outQueues = this.getQueueOut(message.messageName);
    outQueues.forEach((queue: string) => {
      this.logger.log(`Sending message ${message.messageName} to ${queue}`);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    });
  }
}
