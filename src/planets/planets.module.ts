import { Module } from '@nestjs/common'
import { PlanetsService } from './planets.service'
import { PlanetsController } from './planets.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Planet } from 'src/planets/entities/planet.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * PlanetsModule
 *
 * This module provides functionalities related to planets. It imports the
 * `PlanetsController` which handles API requests for planets, and the
 * `PlanetsService` which takes care of business logic for planets.
 * Additionally, it imports the `TypeOrmModule` to establish database connections
 * for the relevant entities:
 *   - People (people may originate from planets)
 *   - Film (planets may be featured in films)
 *   - Species (species may originate from planets)
 *   - Planet (primary entity)
 *   - Starship (starships may travel to planets)
 *   - Vehicle (vehicles may travel to planets)
 *   - Image (planets may have associated images)
 * (Other entity imports might be required depending on relationships)
 *
 * The module also exports `TypeOrmModule` to make it available for other modules
 * that might need database access to these entities.
 *
 * Finally, the module provides the `PlanetsService` and any other services
 * (like `ImagesService`) used within the module.
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
  controllers: [PlanetsController],
  providers: [PlanetsService, ImagesService],
})
export class PlanetsModule {}
