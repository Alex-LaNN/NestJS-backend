import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { formatUptime } from "src/shared/common.functions"
import { DataSource } from "typeorm"


@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check() {
    const dbConnection = this.dataSource.isInitialized

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      database: dbConnection ? 'connected' : 'disconnected',
      uptime: formatUptime(process.uptime()),
      memory: {
        heapUsed:
          Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        heapTotal:
          Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
      },
    }
  }
}