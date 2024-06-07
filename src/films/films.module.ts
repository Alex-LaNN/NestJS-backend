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
