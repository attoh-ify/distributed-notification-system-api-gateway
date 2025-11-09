import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  constructor(private config: ConfigService) {};

  async checkHealth() {
    const rabbitOk = await this.checkRabbitMQ();
    const redisOk = await this.checkRedis();

    return {
      success: true,
      message: 'Gateway health check successful',
      data: {
        rabbitmq: rabbitOk ? 'connected' : 'unreachable',
        redis: redisOk ? 'connected' : 'unreachable',
      },
    };
  };

  private async checkRabbitMQ() {
    try {
      const url = this.config.get('rabbitmq.url') || 'amqp://localhost:5672';
      const conn = await amqp.connect(url);
      await conn.close();
      console.log("Rabbitmq URL: ", url);
      return true;
    } catch {
      return false;
    };
  };

  private async checkRedis() {
    try {
      const redisUrl = this.config.get('redis.url') || 'redis://localhost:6379';
      const client = new Redis(redisUrl);
      console.log("Redis URL: ", redisUrl);
      await client.ping();
      client.disconnect();
      return true;
    } catch {
      return false;
    };
  };
};
