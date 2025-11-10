import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RabbitMQModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule {};
