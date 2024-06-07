import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { AbstractEntity } from '../../shared/abstract.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Film } from '../../films/entities/film.entity'
import { People } from '../../people/entities/people.entity'
import { Image } from '../../images/entities/image.entity'

@Entity({ name: 'vehicles' })
export class Vehicle extends AbstractEntity<Vehicle> {
  @Column()
  @ApiProperty({
    description:
      'The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".',
  })
  name: string

  @Column()
  @ApiProperty({
    description:
      'The model or official name of this vehicle. Such as "All-Terrain Attack Transport".',
  })
  model: string

  @Column()
  @ApiProperty({
    description:
      'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".',
  })
  vehicle_class: string

  @Column()
  @ApiProperty({
    description:
      'The manufacturer of this vehicle. Comma separated if more than one.',
  })
  manufacturer: string

  @Column()
  @ApiProperty({
    description: 'The length of this vehicle in meters.',
  })
  length: string

  @Column()
  @ApiProperty({
    description: 'The cost of this vehicle new, in Galactic Credits.',
  })
  cost_in_credits: string

  @Column()
  @ApiProperty({
    description: 'The number of personnel needed to run or pilot this vehicle.',
  })
  crew: string

  @Column()
  @ApiProperty({
    description:
      'The number of non-essential people this vehicle can transport.',
  })
  passengers: string

  @Column()
  @ApiProperty({
    description: 'The maximum speed of this vehicle in the atmosphere.',
  })
  max_atmosphering_speed: string

  @Column()
  @ApiProperty({
    description:
      'The maximum number of kilograms that this vehicle can transport.',
  })
  cargo_capacity: string

  @Column()
  @ApiProperty({
    description:
      'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.',
  })
  consumables: string

//  @Column()
  @ManyToMany(() => Film, (films) => films.vehicles)
  @JoinTable({ name: 'films_vehicles' })
  @ApiProperty({
    description:
      'An array of Film URL Resources that this vehicle has appeared in.',
  })
  films: Film[]

  //  @Column()
  @ManyToMany(() => People, (people) => people.vehicles)
  @JoinTable({ name: 'people_vehicles' })
  @ApiProperty({
    description:
      ' An array of People URL Resources that this vehicle has been piloted by.',
  })
  pilots: People[]

  //  @Column()
  @OneToMany(() => Image, (images) => images.vehicles)
  @ApiProperty({
    description: 'An array of image resource URLs for this vehicles.',
  })
  @JoinTable({ name: 'vahicle_images' })
  images?: Image[]
}
