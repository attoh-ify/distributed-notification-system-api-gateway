import { Injectable } from "@nestjs/common";
import * as amqp from "amqplib";
import Redis from "ioredis";

@Injectable()
export class HealthService {
    async checkHealth() {
        const rabbitOk = await this.checkRabbitMQ();
        const redisOk = await this.checkRedis();

        return {
            success: true,
            message: "Gateway health check successful",
            data: {
                rabbitmq: rabbitOk ? "connected" : "unreachable",
                redis: redisOk ? "connected" : "unreachable",
            },
        };
    };

    private async checkRabbitMQ() {
        try {
            const conn = await amqp.connect(process.env.RABBITMQ_URL);
            await conn.close();
            return true;
        } catch {
            return false;
        };
    };

    private async checkRedis() {
        try {
            const client = new Redis(process.env.REDIS_URL!);
            await client.ping();
            client.disconnect();
            return true;
        } catch {
            return false;
        };
    };
};