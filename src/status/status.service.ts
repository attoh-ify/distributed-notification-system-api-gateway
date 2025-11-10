import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class StatusService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setStatus(notificationId: string, status: string) {
    await this.redisClient.hset(
      `notification:${notificationId}`,
      'status',
      status,
    );
    await this.redisClient.hset(
      `notification:${notificationId}`,
      'last_updated',
      new Date().toISOString(),
    );
  }

  async getStatus(notificationId: string) {
    const data = await this.redisClient.hgetall(
      `notification:${notificationId}`,
    );
    if (!data || !data.status) {
      return {
        status: 'UNKNOWN',
        last_updated: null,
      };
    }
    return data;
  }
}
