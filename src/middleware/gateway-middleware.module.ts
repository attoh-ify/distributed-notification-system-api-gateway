import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';

@Module({})
export class MiddlewareModule implements NestModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const userServiceUrl = this.config.get<string>('services.user_service_url');

    // Security headers
    consumer.apply(helmet()).forRoutes('*');

    // CORS
    consumer.apply(cors({ origin: '*' })).forRoutes('*');

    // JSON parsing
    consumer
      .apply(bodyParser.json({ limit: '5mb' }))
      .forRoutes('*');

    // Logging
    consumer.apply(morgan('combined')).forRoutes('*');

    // Proxying user requests
    consumer
      .apply(
        createProxyMiddleware({
          target: userServiceUrl,
          changeOrigin: true,
          pathRewrite: {
            '^/signup': '/api/users/signup',
            '^/login': '/api/users/login',
            '^/users': '/api/users',
          },
          on: {
            proxyReq: (proxyReq, req, res) => {
              console.log(`[Proxy] ${req.method} -> ${req.url}`);
            },
            error: (err, req, res) => {
              console.error(`[Proxy Error] ${err.message}`);
              (res as any).writeHead(502, {
                'Content-Type': 'application/json',
              });
              (res as any).end(
                JSON.stringify({
                  success: false,
                  message: 'Proxy error',
                  error: err.message,
                }),
              );
            },
          },
        }),
      )
      .forRoutes('/signup', '/login', '/users');
  }
}
