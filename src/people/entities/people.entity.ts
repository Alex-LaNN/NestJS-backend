import { AbstractEntity } from 'src/shared/abstract.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Planet } from '../../planets/entities/planet.entity'
import { Film } from '../../films/entities/film.entity'
import { Image } from '../../images/entities/image.entity'
import { Species } from '../../species/entities/species.entity'
import { Vehicle } from '../../vehicles/entities/vehicle.entity'
import { Starship } from '../../starships/entities/starship.entity'

@Entity({ name: 'people' })
export class People extends AbstractEntity<People> {
  @Column()
  @ApiProperty({ description: 'The name of this person' })
  name: string

  @Column()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url: string

  @Column()
  @ApiProperty({ description: 'The height of the person in centimeters.' })
  height: string

  @Column()
  @ApiProperty({ description: 'The mass of the person in kilograms.' })
  mass: string

  @Column()
  @ApiProperty({
    description:
      'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.',
  })
  hair_color: string

  @Column()
  @ApiProperty({ description: 'The skin color of this person.' })
  skin_color: string

  @Column()
  @ApiProperty({
    description:
      'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.',
  })
  eye_color: string

  @Column()
  @ApiProperty({
    description:
      'The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin.',
  })
  birth_year: string

  @Column()
  @ApiProperty({
    description:
      'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.',
  })
  gender: string

  @ApiProperty({
    description:
      'The URL of a planet resource, a planet that this person was born on or inhabits.',
  })
  @ManyToOne(() => Planet, (planets) => planets.residents, { cascade: true })
  homeworld?: Planet | null

  @ApiProperty({
    description: 'An array of film resource URLs that this person has been in.',
  })
  @ManyToMany(() => Film, (films) => films.characters, { cascade: true })
  @JoinTable({ name: 'people_films' })
  films: Film[]

  @ApiProperty({
    description:
      'An array of resource IDs of the species to which this person belongs.',
  })
  @ManyToMany(() => Species, (species) => species.people, { cascade: true })
  @JoinTable({ name: 'people_species' })
  species: Species[]

  @ApiProperty({
    description:
      'An array of resource IDs of the vehicles this person piloted.',
  })
  @ManyToMany(() => Vehicle, (vehicles) => vehicles.pilots, { cascade: true })
  @JoinTable({ name: 'people_vehicles' })
  vehicles: Vehicle[]

  @ApiProperty({
    description:
      'An array of resource IDs of the spaceships that this person piloted.',
  })
  @ManyToMany(() => Starship, (starships) => starships.pilots, {
    cascade: true,
  })
  @JoinTable({ name: 'people_starships' })
  starships: Starship[]

  @ApiProperty({
    description: 'An array of image resource IDs owned by this person.',
  })
  @OneToMany(() => Image, (images) => images.people)
  @JoinTable({ name: 'people_images' })
  images?: Image[]
}
