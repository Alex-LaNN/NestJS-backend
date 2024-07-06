import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmOptions } from './typeorm.options.ts'
import { SeedDatabase } from './seed.database'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptions,
    }),
  ],
  providers: [TypeOrmOptions, SeedDatabase ],
  exports: [TypeOrmOptions],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly seedDatabase: SeedDatabase) {}
  async onModuleInit() {
    await this.seedDatabase.synchronizeDatabase()
  }
}
