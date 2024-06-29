import { ApiProperty } from '@nestjs/swagger'
import { AbstractEntity } from 'src/shared/abstract.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm'
import { People } from '../../people/entities/people.entity'
import { Image } from '../../images/entities/image.entity'
import { Planet } from '../../planets/entities/planet.entity'
import { Starship } from '../../starships/entities/starship.entity'
import { Species } from '../../species/entities/species.entity'
import { Vehicle } from '../../vehicles/entities/vehicle.entity'

@Entity({ name: 'films' })
export class Film extends AbstractEntity<Film> {
  @Column()
  @ApiProperty({ description: 'The title of this film.' })
  title: string

  @Column()
  @Index()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url: string

  @Column()
  @ApiProperty({ description: 'The episode number of this film.' })
  episode_id: number

  @Column({ type: 'text'})
  @ApiProperty({
    description: 'The opening paragraphs at the beginning of this film.',
  })
  opening_crawl: string

  @Column()
  @ApiProperty({ description: 'The name of the director of this film.' })
  director: string

  @Column()
  @ApiProperty({
    description:
      'The name(s) of the producer(s) of this film. Comma separated.',
  })
  producer: string

  @Column()
  @ApiProperty({
    description:
      'The ISO 8601 date format of film release at original creator country.',
  })
  release_date: Date

  @ManyToMany(() => People, (people) => people.films)
  @JoinTable({ name: 'people_films' })
  @ApiProperty({
    description: 'An array of people resource URLs that are in this film.',
  })
  characters: People[]

  @ManyToMany(() => Species, (species) => species.films, { cascade: true })
  @JoinTable({ name: 'films_species' })
  @ApiProperty({
    description: 'An array of species resource URLs that are in this film.',
  })
  species: Species[]

  @ManyToMany(() => Starship, (starships) => starships.films, {
    cascade: true,
  })
  @JoinTable({ name: 'films_starships' })
  @ApiProperty({
    description: 'An array of starship resource URLs that are in this film.',
  })
  starships: Starship[]

  @ManyToMany(() => Vehicle, (vehicles) => vehicles.films, { cascade: true })
  @JoinTable({ name: 'films_vehicles' })
  @ApiProperty({
    description: 'An array of vehicle resource URLs that are in this film.',
  })
  vehicles: Vehicle[]

  @ManyToMany(() => Planet, (planets) => planets.films, { cascade: true })
  @JoinTable({ name: 'films_planets' })
  @ApiProperty({
    description: 'An array of planet resource URLs that are in this film.',
  })
  planets: Planet[]

  @OneToMany(() => Image, (images) => images.films)
  @ApiProperty({
    description: 'An array of image resource URLs for this movie.',
  })
  @JoinTable({ name: 'film_images' })
  images?: Image[]
}
