import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { formatUptime } from "src/shared/common.functions"
import { DataSource } from "typeorm"

/**
 * HealthService provides health check information for the application.
 *
 * This service is responsible for checking the health status of the database connection and providing
 * information about the application's version, uptime, and memory usage.
 */
@Injectable()
export class HealthService {
  constructor(
    /**
     * Injects the DataSource instance to check the database connection status.
     *
     * @param dataSource - The DataSource instance provided by NestJS.
     */
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Checks the health status of the application and returns a health check object.
   *
   * This method checks the database connection status and gathers information about the application's version,
   * uptime, and memory usage. It then returns a JSON object containing the health check information.
   *
   * @returns A JSON object containing the health check information.
   */
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