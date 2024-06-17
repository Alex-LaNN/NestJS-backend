import { ApiProperty } from '@nestjs/swagger'
import { AbstractEntity } from 'src/shared/abstract.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm'
import { People } from '../../people/entities/people.entity'
import { Film } from '../../films/entities/film.entity'
import { Image } from '../../images/entities/image.entity'

@Entity({ name: 'planets' })
export class Planet extends AbstractEntity<Planet> {
  @Column()
  @ApiProperty({ description: 'The name of this planet.' })
  name: string

  @Column()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url: string

  @Column()
  @ApiProperty({
    description: 'The climate of this planet. Comma separated if diverse.',
  })
  climate: string

  @Column()
  @ApiProperty({ description: 'The diameter of this planet in kilometers.' })
  diameter: string

  @Column()
  @ApiProperty({
    description:
      'The number of standard hours it takes for this planet to complete a single rotation on its axis.',
  })
  rotation_period: string

  @Column()
  @ApiProperty({
    description:
      'The number of standard days it takes for this planet to complete a single orbit of its local star.',
  })
  orbital_period: string

  @Column()
  @ApiProperty({
    description:
      'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.',
  })
  gravity: string

  @Column()
  @ApiProperty({
    description:
      'The average population of sentient beings inhabiting this planet.',
  })
  population: string

  @Column()
  @ApiProperty({
    description: 'The terrain of this planet. Comma separated if diverse.',
  })
  terrain: string

  @Column()
  @ApiProperty({
    description:
      'The percentage of the planet surface that is naturally occurring water or bodies of water.',
  })
  surface_water: string

  @ApiProperty({
    description: 'An array of People URL Resources that live on this planet.',
  })
  @OneToMany(() => People, (people) => people.homeworld)
  @JoinTable({ name: 'people_planets' })
  residents?: People[] | null

  @ApiProperty({
    description:
      'An array of Film URL Resources that this planet has appeared in.',
  })
  @ManyToMany(() => Film, (films) => films.planets)
  @JoinTable({ name: 'films_planets' })
  films: Film[]

  @ApiProperty({
    description: 'An array of images resource URLs that are in this person.',
  })
  @OneToMany(() => Image, (image) => image.planets)
  @JoinTable({ name: 'planets_images' })
  images?: Image[]
}
