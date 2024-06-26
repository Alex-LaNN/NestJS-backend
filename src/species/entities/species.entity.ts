import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { AbstractEntity } from '../../shared/abstract.entity'
import { ApiProperty } from '@nestjs/swagger'
import { People } from '../../people/entities/people.entity'
import { Film } from '../../films/entities/film.entity'
import { Image } from 'src/images/entities/image.entity'
import { Planet } from '../../planets/entities/planet.entity'
import { IsOptional } from 'class-validator'

@Entity({ name: 'species' })
export class Species extends AbstractEntity<Species> {
  @Column()
  @ApiProperty({ description: 'The name of this species.' })
  name: string

  @Column()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url: string

  @Column()
  @ApiProperty({
    description:
      'The classification of this species, such as "mammal" or "reptile".',
  })
  classification: string

  @Column()
  @ApiProperty({
    description: 'The designation of this species, such as "sentient".',
  })
  designation: string

  @Column()
  @ApiProperty({
    description: 'The average height of this species in centimeters.',
  })
  average_height: string

  @Column()
  @ApiProperty({
    description: 'The average lifespan of this species in years.',
  })
  average_lifespan: string

  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common eye colors for this species, "none" if this species does not typically have eyes.',
  })
  eye_colors: string

  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common hair colors for this species, "none" if this species does not typically have hair.',
  })
  hair_colors: string

  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common skin colors for this species, "none" if this species does not typically have skin.',
  })
  skin_colors: string

  @Column()
  @ApiProperty({
    description: ' The language commonly spoken by this species.',
  })
  language: string

  @IsOptional()
  @OneToOne(() => Planet, (planets) => planets.id)
  @ApiProperty({
    description:
      'The URL of a planet resource, a planet that this species originates from.',
  })
  @JoinColumn()
  homeworld?: Planet | null

  @ManyToMany(() => People, (people) => people.species)
  @JoinTable({ name: 'people_species' })
  @ApiProperty({
    description:
      'An array of People URL Resources that are a part of this species.',
  })
  people: People[]

  @ManyToMany(() => Film, (films) => films.species)
  @JoinTable({ name: 'films_species' })
  @ApiProperty({
    description:
      'An array of Film URL Resources that this species has appeared in.',
  })
  films: Film[]

  @OneToMany(() => Image, (images) => images.species)
  @ApiProperty({
    description: 'An array of image resource URLs for this species.',
  })
  @JoinTable({ name: 'species_images' })
  images?: Image[]
}
