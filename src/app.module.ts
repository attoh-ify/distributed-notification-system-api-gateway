import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { HealthModule } from "./health/health.module";
import { StatusLog } from "./models/status-log.model";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_PASS,
      autoLoadModels: true,
      synchronize: true,
      models: [StatusLog],
      logging: false,
    }),
    HealthModule
  ],
})
export class AppModule {};
