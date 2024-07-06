import { Module } from '@nestjs/common'
import { PeopleModule } from './people/people.module'
import { AuthModule } from './auth/auth.module'
import { FilmsModule } from './films/films.module'
import { PlanetsModule } from './planets/planets.module'
import { ImagesModule } from './images/images.module'
import { StarshipsModule } from './starships/starships.module'
import { VehiclesModule } from './vehicles/vehicles.module'
import { SpeciesModule } from './species/species.module'
import { UserModule } from './user/user.module'

// Database related imports
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/config'
import { ConfigModule } from '@nestjs/config'
import { SeedDatabase } from './database/seed.database'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({ isGlobal: true }),
    // Database connection
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions
      },
    }),
    // Database utilities
    DatabaseModule,
    // Feature modules
    AuthModule,
    UserModule,
    PeopleModule,
    FilmsModule,
    PlanetsModule,
    ImagesModule,
    StarshipsModule,
    VehiclesModule,
    SpeciesModule,
  ],
  providers: [
    // Database seeding service
    SeedDatabase,
  ],
})
export class AppModule {}
