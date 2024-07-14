import { Module } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { VehiclesController } from './vehicles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Image } from 'src/images/entities/image.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * Vehicles Module
 *
 * This module provides functionalities related to vehicle management. It imports the
 * `VehiclesController` which handles API requests for vehicles, and the
 * `VehiclesService` which takes care of business logic for vehicles.
 * Additionally, it imports the `TypeOrmModule` to establish a database connection
 * for the relevant entities:
 *
 * - `People`: Represents individuals associated with vehicles and other entities.
 * - `Film`: Represents films that may have associated vehicles.
 * - `Planet`: Represents planets that may have associated vehicles.
 * - `Species`: Represents species that may have associated vehicles.
 * - `Starship`: Represents starships that may have associated vehicles.
 * - `Vehicle`: Represents the vehicle entities themselves.
 * - `Image`: Represents the image entities associated with vehicles.
 *
 * This module exports the `TypeOrmModule` to make the database connection accessible
 * to other modules that might need to interact with vehicles.
 *
 * Controllers in this module (`VehiclesController`) handle vehicle-related API requests.
 * Providers in this module (`VehiclesService` and `ImagesService`) handle vehicle-related
 * and image-related business logic, respectively.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      People,
      Film,
      Planet,
      Species,
      Starship,
      Vehicle,
      Image,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, ImagesService],
})
export class VehiclesModule {}
