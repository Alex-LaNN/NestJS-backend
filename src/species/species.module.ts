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
