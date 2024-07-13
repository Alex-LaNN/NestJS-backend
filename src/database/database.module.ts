import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmOptions } from './typeorm.options.ts'
import { SeedDatabase } from './seed.database'
import { ConfigModule } from '@nestjs/config'

/**
 * DatabaseModule: Manages Database Connection and Seeding (Optional)
 *
 * This module configures and initializes the connection to the database using TypeORM.
 * It also provides an optional `SeedDatabase` service for populating the database
 * with initial data on application startup.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
  ],
  providers: [TypeOrmOptions, SeedDatabase],
  exports: [TypeOrmOptions],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly seedDatabase: SeedDatabase) {} // Inject SeedDatabase service
  async onModuleInit() {
    // Seed the database with initial data (optional)
    await this.seedDatabase.synchronizeDatabase()
  }
}
