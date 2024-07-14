import { Module } from '@nestjs/common'
import { SpeciesService } from './species.service'
import { SpeciesController } from './species.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Species } from 'src/species/entities/species.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * SpeciesModule
 *
 * This module provides functionalities related to species. It imports the
 * `SpeciesController` which handles API requests for species, and the
 * `SpeciesService` which takes care of business logic for species.
 * Additionally, it imports the `TypeOrmModule` to establish database connections
 * for the relevant entities:
 *   - People
 *   - Film
 *   - Planet (species may originate from planets)
 *   - Species (primary entity)
 *   - Starship (species may be associated with starships)
 *   - Vehicle (species may be associated with vehicles)
 *   - Image (species may have associated images)
 * (Other entity imports might be required depending on relationships)
 *
 * The module also exports `TypeOrmModule` to make it available for other modules
 * that might need database access to these entities.
 *
 * Finally, the module provides the `SpeciesService` and any other services
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
  controllers: [SpeciesController],
  providers: [SpeciesService, ImagesService],
})
export class SpeciesModule {}
