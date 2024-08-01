import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { ImagesController } from './images.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'

/**
 * ImagesModule
 *
 * This module provides functionalities related to image management. It imports the
 * `ImagesController` which handles API requests for images, and the
 * `ImagesService` which takes care of business logic for images.
 * Additionally, it imports the `TypeOrmModule` to establish a database connection
 * for the relevant entities:
 *
 * - `People`: Represents individuals associated with films and other entities.
 * - `Film`: Represents films that may have associated images.
 * - `Planet`: Represents planets that may have associated images.
 * - `Species`: Represents species that may have associated images.
 * - `Starship`: Represents starships that may have associated images.
 * - `Vehicle`: Represents vehicles that may have associated images.
 * - `Image`: Represents the image entities themselves.
 *
 * This module exports both `TypeOrmModule` and `ImagesService`:
 * - `TypeOrmModule`: This makes the database connection accessible to other modules
 *   that might need to interact with images.
 * - `ImagesService`: This allows other modules to inject the `ImagesService`
 *   for functionalities like image retrieval or manipulation.
 *
 * Controllers in this module (`ImagesController`) handle image-related API requests.
 * Providers in this module (`ImagesService`) handle image-related business logic.
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
  exports: [TypeOrmModule, ImagesService],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
