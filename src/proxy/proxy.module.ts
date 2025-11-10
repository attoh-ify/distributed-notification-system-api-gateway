import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({})
export class ProxyModule implements NestModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const userServiceUrl = this.config.get<string>('services.user_service_url');

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
