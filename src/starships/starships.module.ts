import { Module } from '@nestjs/common'
import { StarshipsService } from './starships.service'
import { StarshipsController } from './starships.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Image } from 'src/images/entities/image.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * StarshipsModule
 *
 * This module provides functionalities related to starships. It imports the
 * `StarshipsController` which handles API requests for starships, and the
 * `StarshipsService` which takes care of business logic for starships.
 * Additionally, it imports the `TypeOrmModule` to establish database connections
 * for the relevant entities:
 *   - People
 *   - Film
 *   - Starship (primary entity)
 *   - Image
 *   - Planet
 *   - Species
 *   - Vehicle
 * (Other entity imports might be required depending on relationships)
 *
 * The module also exports `TypeOrmModule` to make it available for other modules
 * that might need database access to these entities.
 *
 * Finally, the module provides the `StarshipsService` and any other services
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
  controllers: [StarshipsController],
  providers: [StarshipsService, ImagesService],
})
export class StarshipsModule {}
