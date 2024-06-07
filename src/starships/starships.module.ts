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
