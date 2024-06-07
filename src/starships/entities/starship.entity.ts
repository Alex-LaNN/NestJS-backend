import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { AbstractEntity } from '../../shared/abstract.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Film } from '../../films/entities/film.entity'
import { Image } from '../../images/entities/image.entity'
import { People } from '../../people/entities/people.entity'

@Entity({ name: 'starships' })
export class Starship extends AbstractEntity<Starship> {
  @Column()
  @ApiProperty({
    description:
      'The name of this starship. The common name, such as "Death Star".',
  })
  name: string

  @Column()
  @ApiProperty({
    description:
      'The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".',
  })
  model: string

  @Column()
  @ApiProperty({
    description:
      'The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation"',
  })
  starship_class: string

  @Column()
  @ApiProperty({
    description:
      'The manufacturer of this starship. Comma separated if more than one.',
  })
  manufacturer: string

  @Column()
  @ApiProperty({
    description: 'The cost of this starship new, in galactic credits.',
  })
  cost_in_credits: string

  @Column()
  @ApiProperty({ description: 'The length of this starship in meters.' })
  length: string

  @Column()
  @ApiProperty({
    description:
      'The number of personnel needed to run or pilot this starship.',
  })
  crew: string

  @Column()
  @ApiProperty({
    description:
      'The number of non-essential people this starship can transport.',
  })
  passengers: string

  @Column()
  @ApiProperty({
    description:
      'The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.',
  })
  max_atmosphering_speed: string

  @Column()
  @ApiProperty({
    description: 'The class of this starships hyperdrive.',
  })
  hyperdrive_rating: string

  @Column()
  @ApiProperty({
    description:
      'The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.',
  })
  MGLT: string

  @Column()
  @ApiProperty({
    description:
      'The maximum number of kilograms that this starship can transport.',
  })
  cargo_capacity: string

  @Column()
  @ApiProperty({
    description:
      'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.',
  })
  consumables: string

  //  @Column()
  @ManyToMany(() => Film, (films) => films.starships)
  @JoinTable({ name: 'films_starships' })
  @ApiProperty({ description: '' })
  films: Film[]

  //  @Column()
  @ManyToMany(() => People, (people) => people.starships)
  @JoinTable({ name: 'people_starships' })
  @ApiProperty({ description: '' })
  pilots: People[]

  //  @Column()
  @OneToMany(() => Image, (images) => images.starships)
  @JoinTable({ name: 'starship_images' })
  images?: Image[]
}
