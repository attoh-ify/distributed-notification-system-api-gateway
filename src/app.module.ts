import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './health/health.module';
import { StatusLog } from './models/status-log.model';
import appConfig from './config/app.config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { RedisModule } from './redis/redis.module';
import { ProxyModule } from './proxy/proxy.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get('database');
        return {
          dialect: db.dialect,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          autoLoadModels: true,
          synchronize: true,
          models: [StatusLog],
          logging: false,
        };
      },
    }),
    HealthModule,
    RabbitMQModule,
    RedisModule,
    ProxyModule,
    NotificationModule,
  ],
})
export class AppModule {}
