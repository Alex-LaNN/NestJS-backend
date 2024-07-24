import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { AbstractEntity } from '../../shared/abstract.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Film } from '../../films/entities/film.entity'
import { Image } from '../../images/entities/image.entity'
import { People } from '../../people/entities/people.entity'

/**
 * Starship Entity
 *
 * This class represents the `Starship` entity stored in the database. It defines
 * the properties of a starship within the Star Wars universe and specifies the
 * relationships between this entity and other entities like Film, People, and Image.
 * Each property is decorated with TypeORM decorators for database mapping and
 * `@nestjs/swagger`'s `ApiProperty` for API documentation.
 */
@Entity({ name: 'starships' })
export class Starship extends AbstractEntity<Starship> {
  /**
   * name: The common name of the starship (string)
   *
   * This property represents the common name of the starship, such as "Death Star".
   * It is decorated with @Column for database mapping and @ApiProperty for
   * Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The name of this starship. The common name, such as "Death Star".',
  })
  name: string

  /**
   * url: The hypermedia URL of the starship (string)
   *
   * This property represents the hypermedia URL of the starship. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column({ nullable: true })
  @ApiProperty({ description: 'The hypermedia URL of this resource.' })
  url?: string

  /**
   * model: The model or official name of the starship (string)
   *
   * This property represents the model or official name of the starship,
   * such as "T-65 X-wing" or "DS-1 Orbital Battle Station".
   * It is decorated with @Column for database mapping and @ApiProperty for
   *  Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".',
  })
  model: string

  /**
   * starship_class: The class of the starship (string)
   *
   * This property represents the class of the starship, such as "Starfighter" or
   * "Deep Space Mobile Battlestation".
   * It is decorated with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation"',
  })
  starship_class: string

  /**
   * manufacturer: The manufacturer of the starship (string)
   *
   * This property represents the manufacturer of the starship. If there is
   * more than one manufacturer, the names are comma-separated.
   * It is decorated with @Column for database mapping and @ApiProperty
   * for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The manufacturer of this starship. Comma separated if more than one.',
  })
  manufacturer: string

  /**
   * cost_in_credits: The cost of the starship in galactic credits (string)
   *
   * This property represents the cost of the starship when new, in galactic credits.
   * It is decorated with @Column for database mapping and @ApiProperty for
   * Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description: 'The cost of this starship new, in galactic credits.',
  })
  cost_in_credits: string

  /**
   * length: The length of the starship in meters (string)
   *
   * This property represents the length of the starship in meters. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The length of this starship in meters.' })
  length: string

  /**
   * crew: The number of personnel needed to run or pilot the starship (string)
   *
   * This property represents the number of personnel needed to run or pilot the starship.
   * It is decorated with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The number of personnel needed to run or pilot this starship.',
  })
  crew: string

  /**
   * passengers: The number of non-essential people the starship can transport (string)
   *
   * This property represents the number of non-essential people the starship can transport.
   * It is decorated with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The number of non-essential people this starship can transport.',
  })
  passengers: string

  /**
   * max_atmosphering_speed: The maximum speed of the starship in the atmosphere (string)
   *
   * This property represents the maximum speed of the starship in the atmosphere.
   * It is "N/A" if the starship is incapable of atmospheric flight. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.',
  })
  max_atmosphering_speed: string

  /**
   * hyperdrive_rating: The class of the starship's hyperdrive (string)
   *
   * This property represents the class of the starship's hyperdrive. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description: 'The class of this starships hyperdrive.',
  })
  hyperdrive_rating: string

  /**
   * MGLT: The maximum number of Megalights the starship can travel in a standard hour (string)
   *
   * This property represents the maximum number of Megalights the starship can travel in a standard hour.
   * A "Megalight" is a standard unit of distance used in the Star Wars universe. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.',
  })
  MGLT: string

  /**
   * cargo_capacity: The maximum number of kilograms the starship can transport (string)
   *
   * This property represents the maximum number of kilograms the starship can transport. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The maximum number of kilograms that this starship can transport.',
  })
  cargo_capacity: string

  /**
   * consumables: The maximum length of time the starship can provide consumables for its crew without resupplying (string)
   *
   * This property represents the maximum length of time the starship can provide consumables for its crew without
   * resupplying. It is decorated with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.',
  })
  consumables: string

  /**
   * films: The films featuring this starship (Film[])
   *
   * This property represents an array of `Film` entities that feature this starship.
   * It is decorated with `@ManyToMany` to specify the many-to-many relationship between
   * Starship and Film entities, @JoinTable to define the join table name, and @ApiProperty
   * for Swagger documentation.
   */
  @ManyToMany(() => Film, (films) => films.starships)
  @JoinTable({ name: 'films_starships' })
  @ApiProperty({ description: '' })
  films: Film[]

  /**
   * pilots: The pilots who have piloted this starship (People[])
   *
   * This property represents an array of `People` entities who have piloted this starship.
   * It is decorated with `@ManyToMany` to specify the many-to-many relationship between
   * Starship and People entities, @JoinTable to define the join table name, and @ApiProperty
   * for Swagger documentation.
   */
  @ManyToMany(() => People, (people) => people.starships)
  @JoinTable({ name: 'people_starships' })
  @ApiProperty({ description: '' })
  pilots: People[]

  /**
   * images: The images related to this starship (Image[] | undefined)
   *
   * This property represents an array of `Image` entities related to this starship.
   * It is decorated with @OneToMany to specify the one-to-many relationship between
   * Starship and Image entities, and @ApiProperty for Swagger documentation. It is
   * optional and can be undefined.
   */
  @OneToMany(() => Image, (images) => images.starships)
  images?: Image[]
}
