import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { AbstractEntity } from '../../shared/abstract.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Film } from '../../films/entities/film.entity'
import { People } from '../../people/entities/people.entity'
import { Image } from '../../images/entities/image.entity'

/**
 * Vehicle Entity
 *
 * This class represents a Vehicle entity in the database. It defines the vehicle's
 * properties and uses various decorators to manage database mappings, data validation,
 * and API documentation exposure.
 */
@Entity({ name: 'vehicles' })
export class Vehicle extends AbstractEntity<Vehicle> {
  /**
   * 'name' property
   *
   * This property represents the name of the vehicle. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * of the vehicle's common name.
   */
  @Column()
  @ApiProperty({
    description:
      'The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".',
  })
  name: string

  /**
   * 'url' property
   *
   * This property represents the hypermedia URL of this resource. It is mapped to a
   * database column and decorated with `ApiProperty` for Swagger documentation.
   */
  @Column({ nullable: true })
  @ApiProperty({ description: 'The hypermedia URL of this resource.' })
  url?: string

  /**
   * 'model' property
   *
   * This property represents the model or official name of the vehicle. It is mapped to
   * a database column and decorated with `ApiProperty` for Swagger documentation, specifying
   * a description of the vehicle's model.
   */
  @Column()
  @ApiProperty({
    description:
      'The model or official name of this vehicle. Such as "All-Terrain Attack Transport".',
  })
  model: string

  /**
   * 'vehicle_class' property
   *
   * This property represents the class of the vehicle. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * of the vehicle's class.
   */
  @Column()
  @ApiProperty({
    description:
      'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".',
  })
  vehicle_class: string

  /**
   * 'manufacturer' property
   *
   * This property represents the manufacturer of the vehicle. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * of the vehicle's manufacturer.
   */
  @Column()
  @ApiProperty({
    description:
      'The manufacturer of this vehicle. Comma separated if more than one.',
  })
  manufacturer: string

  /**
   * 'length' property
   *
   * This property represents the length of the vehicle in meters. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * of the vehicle's length.
   */
  @Column()
  @ApiProperty({
    description: 'The length of this vehicle in meters.',
  })
  length: string

  /**
   * 'cost_in_credits' property
   *
   * This property represents the cost of the vehicle new, in Galactic Credits. It is mapped to
   * a database column and decorated with `ApiProperty` for Swagger documentation, specifying
   * a description of the vehicle's cost.
   */
  @Column()
  @ApiProperty({
    description: 'The cost of this vehicle new, in Galactic Credits.',
  })
  cost_in_credits: string

  /**
   * 'crew' property
   *
   * This property represents the number of personnel needed to run or pilot the vehicle.
   * It is mapped to a database column and decorated with `ApiProperty` for Swagger documentation,
   * specifying a description of the vehicle's crew requirement.
   */
  @Column()
  @ApiProperty({
    description: 'The number of personnel needed to run or pilot this vehicle.',
  })
  crew: string

  /**
   * 'passengers' property
   *
   * This property represents the number of non-essential people this vehicle can transport.
   * It is mapped to a database column and decorated with `ApiProperty` for Swagger documentation,
   * specifying a description of the vehicle's passenger capacity.
   */
  @Column()
  @ApiProperty({
    description:
      'The number of non-essential people this vehicle can transport.',
  })
  passengers: string

  /**
   * 'max_atmosphering_speed' property
   *
   * This property represents the maximum speed of the vehicle in the atmosphere. It is mapped to
   * a database column and decorated with `ApiProperty` for Swagger documentation, specifying
   * a description of the vehicle's maximum speed.
   */
  @Column()
  @ApiProperty({
    description: 'The maximum speed of this vehicle in the atmosphere.',
  })
  max_atmosphering_speed: string

  /**
   * 'cargo_capacity' property
   *
   * This property represents the maximum number of kilograms that the vehicle can transport.
   * It is mapped to a database column and decorated with `ApiProperty` for Swagger documentation,
   * specifying a description of the vehicle's cargo capacity.
   */
  @Column()
  @ApiProperty({
    description:
      'The maximum number of kilograms that this vehicle can transport.',
  })
  cargo_capacity: string

  /**
   * 'consumables' property
   *
   * This property represents the maximum length of time that the vehicle can provide consumables
   * for its entire crew without having to resupply. It is mapped to a database column and decorated
   * with `ApiProperty` for Swagger documentation, specifying a description of the vehicle's consumables.
   */
  @Column()
  @ApiProperty({
    description:
      'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.',
  })
  consumables: string

  /**
   * 'films' property
   *
   * This property represents an array of Film entities that this vehicle has appeared in.
   * It is a many-to-many relationship, mapped to the 'films_vehicles' join table, and decorated
   * with `ApiProperty` for Swagger documentation, specifying a description of the films associated with the vehicle.
   */
  @ManyToMany(() => Film, (films) => films.vehicles)
  @JoinTable({ name: 'films_vehicles' })
  @ApiProperty({
    description:
      'An array of Film URL Resources that this vehicle has appeared in.',
  })
  films: Film[]

  /**
   * 'pilots' property
   *
   * This property represents an array of People entities that have piloted this vehicle.
   * It is a many-to-many relationship, mapped to the 'people_vehicles' join table, and decorated
   * with `ApiProperty` for Swagger documentation, specifying a description of the people associated with the vehicle.
   */
  @ManyToMany(() => People, (people) => people.vehicles)
  @JoinTable({ name: 'people_vehicles' })
  @ApiProperty({
    description:
      ' An array of People URL Resources that this vehicle has been piloted by.',
  })
  pilots: People[]

  /**
   * 'images' property
   *
   * This property represents an array of Image entities associated with this vehicle.
   * It is a one-to-many relationship and decorated with `ApiProperty` for Swagger documentation,
   * specifying a description of the images associated with the vehicle.
   */
  @OneToMany(() => Image, (images) => images.vehicles)
  @ApiProperty({
    description: 'An array of image resource URLs for this vehicles.',
  })
  images?: Image[]
}
