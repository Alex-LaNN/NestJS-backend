import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  Entity,
  JoinTable,
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
    description: 'The URL to the People resource featured in these images.',
  })
  @JoinTable({ name: 'image_people' })
  people: string

  @ManyToOne(() => Film, (films) => films.images)
  @ApiProperty({
    description: 'The URL to the Film resource found in these images.',
  })
  @JoinTable({ name: 'image_films' })
  films: string

  @ManyToOne(() => Planet, (planets) => planets.images)
  @ApiProperty({
    description: 'The URL to the Planet resource featured in these images.',
  })
  @JoinTable({ name: 'image_planets' })
  planets: string

  @ManyToOne(() => Starship, (starships) => starships.images)
  @ApiProperty({
    description: 'The URL to the Starship resource featured in these images.',
  })
  @JoinTable({ name: 'image_starships' })
  starships: string

  @ManyToOne(() => Vehicle, (vehicles) => vehicles.images)
  @ApiProperty({
    description: 'The URL to the Vehicle resource featured in these images.',
  })
  @JoinTable({ name: 'image_vehicles' })
  vehicles: string

  @ManyToOne(() => Species, (species) => species.images)
  @ApiProperty({
    description: 'The URL to the Species resource featured in these images.',
  })
  @JoinTable({ name: 'image_species' })
  species: string
}
