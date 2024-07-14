import { Module } from '@nestjs/common'
import { PeopleService } from './people.service'
import { PeopleController } from './people.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'
import { ImagesService } from 'src/images/images.service'

/**
 * PeopleModule
 *
 * This module provides functionalities related to people (characters) in the Star Wars universe.
 * It imports the `PeopleController` which handles API requests for people, and the
 * `PeopleService` which takes care of business logic for people.
 * Additionally, it imports the `TypeOrmModule` to establish database connections
 * for the relevant entities:
 *   - Film (people may appear in films)
 *   - Planet (people may originate from planets)
 *   - Species (species information for characters)
 *   - Starship (starships piloted or crewed by people)
 *   - Vehicle (vehicles piloted by people)
 *   - People (primary entity)
 *   - Image (people may have associated images)
 * (Other entity imports might be required depending on relationships)
 *
 * This module also exports the `PeopleService` to make it available for injection
 * in other modules that might need to interact with people data.
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
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService, ImagesService],
  exports: [PeopleService],
})
export class PeopleModule {}
