import { Module, Global } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Global()
@Module({
    providers: [
        {
            provide: "REDIS_CLIENT",
            useFactory: (config: ConfigService) => {
                const url = config.get<string>("redis.url") || 'redis://localhost:6379';
                console.log("REDIS URL: ", url);
                return new Redis(url);
            },
            inject: [ConfigService],
        },
    ],
    exports: ["REDIS_CLIENT"],
})
export class RedisModule {};
