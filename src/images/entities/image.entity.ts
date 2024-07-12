import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { People } from '../../people/entities/people.entity'
import { Film } from '../../films/entities/film.entity'
import { Planet } from '../../planets/entities/planet.entity'
import { Starship } from '../../starships/entities/starship.entity'
import { Vehicle } from '../../vehicles/entities/vehicle.entity'
import { Species } from '../../species/entities/species.entity'

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Image identification number.' })
  id: number

  @Column()
  @ApiProperty({ description: 'Unique name of this image.' })
  name: string

  @Column()
  @ApiProperty({ description: 'Description of the image.' })
  description: string

  @Column()
  @ApiProperty({ description: 'URL address of the image storage location.' })
  url: string

  @ManyToOne(() => People, (people) => people.images)
  @ApiProperty({
    description: 'The ID of the People resource featured in this image.',
  })
  people: People

  @ManyToOne(() => Film, (films) => films.images)
  @ApiProperty({
    description: 'The ID of the Film resource featured in this image.',
  })
  films: Film

  @ManyToOne(() => Planet, (planets) => planets.images)
  @ApiProperty({
    description: 'The ID of the Planet resource featured in this image.',
  })
  planets: Planet

  @ManyToOne(() => Starship, (starships) => starships.images)
  @ApiProperty({
    description: 'The ID of the Starship resource featured in this image.',
  })
  starships: Starship

  @ManyToOne(() => Vehicle, (vehicles) => vehicles.images)
  @ApiProperty({
    description: 'The ID of the Vehicle resource featured in this image.',
  })
  vehicles: Vehicle

  @ManyToOne(() => Species, (species) => species.images)
  @ApiProperty({
    description: 'The ID of the Species resource featured in this image.',
  })
  species: Species
}
