import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const rabbitUrl = this.config.get<string>('rabbitmq.url');
    try {
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      console.log('✅ RabbitMQ connection & channel established');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    console.log('🧹 RabbitMQ connection closed');
  }

  async sendNotification(payload: {
    type: 'email' | 'push';
    recipient: string;
    data: Record<string, any>;
  }) {
    const { type, recipient, data } = payload;
    const notification_id = uuidv4();
    console.log('id: ', notification_id);

    const message = {
      notification_id,
      recipient,
      data,
      created_at: new Date().toISOString(),
    };

    const queue =
      type === 'email' ? 'email.queue' : type === 'push' ? 'push.queue' : null;
    if (!queue) throw new Error('Invalid notification type');

    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    return {
      success: true,
      message: `Notification queued successfully`,
      data: { notification_id, queue },
    };
  }
}
