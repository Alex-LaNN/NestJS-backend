import { AbstractEntity } from '../../shared/abstract.entity'
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

/**
 * People Entity: Represents a person resource in the database
 *
 * This class defines the structure of a person entity in the database. It
 * inherits from `AbstractEntity` and utilizes TypeORM decorators to map
 * database columns and relationships.
 */
@Entity({ name: 'people' })
export class People extends AbstractEntity<People> {
  /**
   * name: The name of the person (string)
   *
   * This property represents the name of the person. It is decorated with
   * `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The name of this person' })
  name: string

  /**
   * url: The URL of the person resource (string)
   *
   * This property stores the hypermedia URL for this person resource. It is
   * decorated with `@Column` and `@ApiProperty` for mapping and documentation.
   */
  @Column({ nullable: true })
  @ApiProperty({ description: 'the hypermedia URL of this resource.'})
  url?: string

  /**
   * height: The height of the person in centimeters (string)
   *
   * This property represents the height of the person in centimeters. It is
   * stored as a string value, although it could potentially be converted to a
   * number for calculations if needed. It is decorated with `@Column` for
   * database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The height of the person in centimeters.' })
  height: string

  /**
   * mass: The mass of the person in kilograms (string)
   *
   * This property represents the mass of the person in kilograms. It is stored
   * as a string value, although it could potentially be converted to a number
   * for calculations if needed. It is decorated with `@Column` for
   * database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The mass of the person in kilograms.' })
  mass: string

  /**
   * hair_color: The hair color of the person (string)
   *
   * This property represents the hair color of the person. It can be a specific
   * color value, "unknown" if the information is not available, or "n/a" if the
   * person does not have hair. It is decorated with `@Column` for database mapping
   * and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.',
  })
  hair_color: string

  /**
   * skin_color: The skin color of the person (string)
   *
   * This property represents the skin color of the person. It is decorated with
   * `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The skin color of this person.' })
  skin_color: string

  /**
   * eye_color: The eye color of the person (string)
   *
   * This property represents the eye color of the person. It can be a specific
   * color value, "unknown" if the information is not available, or "n/a" if the
   * person does not have eyes. It is decorated with `@Column` for database mapping
   * and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.',
  })
  eye_color: string

  /**
   * birth_year: The birth year of the person (string)
   *
   * This property represents the birth year of the person using the in-universe
   * standard of BBY or ABY (Before the Battle of Yavin or After the Battle
   * of Yavin). It is decorated with `@Column` for database mapping and
   * `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin.',
  })
  birth_year: string

  /**
   * gender: The gender of the person (string)
   *
   * This property represents the gender of the person. It can be "Male",
   * "Female", "unknown", or "n/a" if the person's gender is not specified. It is
   * decorated with `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.',
  })
  gender: string

  /**
   * homeworld: Planet this person is from (optional, Planet entity)
   *
   * This property represents the planet where the person was born on or
   * inhabits. It is decorated with `@ManyToOne` to define a Many-to-One
   * relationship with the `Planet` entity. `@ApiProperty` provides description.
   * Additionally, `cascade: true` enables cascading operations on the associated
   * planet entity during persistence operations.
   */
  @ApiProperty({
    description:
      'The URL of a planet resource, a planet that this person was born on or inhabits.',
  })
  @ManyToOne(() => Planet, (planets) => planets.residents, { cascade: true })
  homeworld?: Planet | null

  /**
   * films: Films this person has been in (Film[])
   *
   * This property represents an array of `Film` entities representing films
   * where this person appeared.
   * It is decorated with `@ManyToMany` to define a Many-to-Many relationship
   * with the `Film` entity.
   * `@ApiProperty` provides description, and
   * `@JoinTable` specifies the join table name (`people_films`).
   * Additionally, `cascade: true` enables cascading operations on the associated
   * film entities during persistence operations.
   */
  @ApiProperty({
    description: 'An array of film resource URLs that this person has been in.',
  })
  @ManyToMany(() => Film, (films) => films.characters, { cascade: true })
  @JoinTable({ name: 'people_films' })
  films: Film[]

  /**
   * species: Species this person belongs to (Species[])
   *
   * This property represents an array of `Species` entities representing the
   * species this person belongs to. It is decorated with `@ManyToMany` to define
   * a Many-to-Many relationship with the `Species` entity. `@ApiProperty` provides
   * description, and `@JoinTable` specifies the join table name (`people_species`).
   * Additionally, `cascade: true` enables cascading operations on the associated
   * species entities during persistence operations.
   */
  @ApiProperty({
    description:
      'An array of resource IDs of the species to which this person belongs.',
  })
  @ManyToMany(() => Species, (species) => species.people, { cascade: true })
  @JoinTable({ name: 'people_species' })
  species: Species[]

  /**
   * vehicles: Vehicles this person piloted (Vehicle[])
   *
   * This property represents an array of `Vehicle` entities representing vehicles
   * this person piloted. It is decorated with `@ManyToMany` to define a
   * Many-to-Many relationship with the `Vehicle` entity. `@ApiProperty` provides
   * description, and `@JoinTable` specifies the join table name (`people_vehicles`).
   * Additionally, `cascade: true` enables cascading operations on the associated
   * vehicle entities during persistence operations.
   */
  @ApiProperty({
    description:
      'An array of resource IDs of the vehicles this person piloted.',
  })
  @ManyToMany(() => Vehicle, (vehicles) => vehicles.pilots, { cascade: true })
  @JoinTable({ name: 'people_vehicles' })
  vehicles: Vehicle[]

  /**
   * starships: Starships this person piloted (Starship[])
   *
   * This property represents an array of `Starship` entities representing starships
   * this person piloted. It is decorated with `@ManyToMany` to define a
   * Many-to-Many relationship with the `Starship` entity. `@ApiProperty` provides
   * description, and `@JoinTable` specifies the join table name (`people_starships`).
   * Additionally, `cascade: true` enables cascading operations on the associated
   * starship entities during persistence operations.
   */
  @ApiProperty({
    description:
      'An array of resource IDs of the spaceships that this person piloted.',
  })
  @ManyToMany(() => Starship, (starships) => starships.pilots, {
    cascade: true,
  })
  @JoinTable({ name: 'people_starships' })
  starships: Starship[]

  /**
   * images: Images owned by this person (Image[])
   *
   * This property represents an array of `Image` entities representing images
   * owned by this person. It is decorated with `@OneToMany` to define a
   * One-to-Many relationship with the `Image` entity. `@ApiProperty` provides
   * description, and `@JoinTable` specifies the join table name (`people_images`).
   */
  @ApiProperty({
    description: 'An array of image resource IDs owned by this person.',
  })
  @OneToMany(() => Image, (images) => images.people)
  images?: Image[]
}
