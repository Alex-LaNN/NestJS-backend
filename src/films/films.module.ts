import { Module } from '@nestjs/common'
import { FilmsService } from './films.service'
import { FilmsController } from './films.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * FilmsModule
 *
 * This module provides functionalities related to films (movies) in the Star Wars universe.
 * It imports the `FilmsController` which handles API requests for films, and the
 * `FilmsService` which takes care of business logic for films.
 * Additionally, it imports the `TypeOrmModule` to establish database connections
 * for the relevant entities:
 *   - People (people appearing in films)
 *   - Planet (films may take place on planets)
 *   - Species (species information for characters in films)
 *   - Starship (starships featured in films)
 *   - Vehicle (vehicles appearing in films)
 *   - Film (primary entity)
 *   - Image (films may have associated images)
 * (Other entity imports might be required depending on relationships)
 *
 * The module exports `TypeOrmModule` to make the database connection accessible to other modules
 * that might need to interact with film data.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Film,
      People,
      Planet,
      Species,
      Starship,
      Vehicle,
      Image,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [FilmsController],
  providers: [FilmsService, ImagesService],
})
export class FilmsModule {}
