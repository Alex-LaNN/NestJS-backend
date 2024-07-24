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
import { Starship } from './starships/entities/starship.entity'
import { Vehicle } from './vehicles/entities/vehicle.entity'
import { Species } from './species/entities/species.entity'
import { Planet } from './planets/entities/planet.entity'
import { People } from './people/entities/people.entity'
import { Film } from './films/entities/film.entity'
import { Image } from './images/entities/image.entity'

/**
 * AppModule
 *
 * This module serves as the root module of the NestJS application.
 * It imports all necessary feature modules, database configurations,
 * and global settings like configuration and database connection.
 *
 * Feature modules:
 * - AuthModule: Handles authentication and authorization.
 * - UserModule: Manages user-related operations.
 * - PeopleModule: Manages people entities related to films and other entities.
 * - FilmsModule: Manages films and associated entities.
 * - PlanetsModule: Manages planets and associated entities.
 * - ImagesModule: Manages images and associated entities.
 * - StarshipsModule: Manages starships and associated entities.
 * - VehiclesModule: Manages vehicles and associated entities.
 * - SpeciesModule: Manages species and associated entities.
 *
 * Global settings:
 * - ConfigModule.forRoot({ isGlobal: true }): Loads global configuration settings.
 * - TypeOrmModule.forRootAsync({ useFactory: async () => dataSourceOptions }): Establishes database connection using provided options.
 *
 * Database utilities:
 * - DatabaseModule: Provides utilities for database operations such as migrations and seeding.
 *
 * Providers:
 * - SeedDatabase: Service responsible for seeding initial data into the database.
 */
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
    // Register repositories for specific entities to make them available for dependency injection
    TypeOrmModule.forFeature([
      Starship,
      Vehicle,
      Species,
      Planet,
      People,
      Film,
      Image,
    ]),
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
