import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService {
  private readonly queueName = 'friendRequest';

  async sendMessage(message: any): Promise<void> {
    try {
      const connection = await amqp.connect('amqps://zwyfibei:He9wykyX5eXeC4ZBav4-qzIvfPr9e_jE@shark.rmq.cloudamqp.com/zwyfibei');
      const channel = await connection.createChannel();

      await channel.assertQueue(this.queueName, {
        durable: false,
      });

      channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)));
      console.log(" [x] Sent %s", message);

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}
