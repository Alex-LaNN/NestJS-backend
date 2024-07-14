import { ApiProperty } from '@nestjs/swagger'
import { AbstractEntity } from 'src/shared/abstract.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { People } from '../../people/entities/people.entity'
import { Film } from '../../films/entities/film.entity'
import { Image } from '../../images/entities/image.entity'
import { IsOptional } from 'class-validator'

/**
 * Planet Entity
 *
 * This class represents the `Planet` entity stored in the database. It inherits
 * from `AbstractEntity` for common functionality and defines the properties
 * of a planet within the Star Wars universe. It is decorated with TypeORM decorators
 * for database mapping and `@nestjs/swagger`'s `ApiProperty` for API documentation.
 */
@Entity({ name: 'planets' })
export class Planet extends AbstractEntity<Planet> {
  /**
   * name: The name of the planet (string)
   *
   * This property represents the planet's name. It is decorated with `@Column`
   * for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The name of this planet.' })
  name: string

  /**
   * url: The hypermedia URL of this planet (string)
   *
   * This property represents the planet's hypermedia URL. It is decorated with
   * `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url: string

  /**
   * climate: The climate of this planet (string)
   *
   * This property represents the planet's climate. It is decorated with `@Column`
   * for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description: 'The climate of this planet. Comma separated if diverse.',
  })
  climate: string

  /**
   * diameter: The diameter of this planet in kilometers (string)
   *
   * This property represents the planet's diameter in kilometers. It is decorated with
   * `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The diameter of this planet in kilometers.' })
  diameter: string

  /**
   * rotation_period: The rotation period of this planet (string)
   *
   * This property represents the number of standard hours it takes for this planet
   * to complete a single rotation on its axis. It is decorated with `@Column`
   * for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The number of standard hours it takes for this planet to complete a single rotation on its axis.',
  })
  rotation_period: string

  /**
   * orbital_period: The orbital period of this planet (string)
   *
   * This property represents the number of standard days it takes for this planet
   * to complete a single orbit of its local star. It is decorated with `@Column`
   * for database mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The number of standard days it takes for this planet to complete a single orbit of its local star.',
  })
  orbital_period: string

  /**
   * gravity: The gravity of this planet (string)
   *
   * This property represents a number denoting the gravity of this planet,
   * where "1" is normal or 1 standard G, "2" is twice or 2 standard Gs, and
   * "0.5" is half or 0.5 standard Gs. It is decorated with `@Column` for database
   * mapping and `@ApiProperty` for Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.',
  })
  gravity: string

  /**
   * population: The population of this planet (string)
   *
   * This property represents the average population of sentient beings inhabiting
   * this planet. It is decorated with `@Column` for database mapping and
   * `@ApiProperty` for Swagger documentation. It might be preferable to store
   * this as a number for calculations, but validation with `@IsString` enforces
   * a string type for now. Consider future improvements for numeric storage.
   */
  @Column()
  @ApiProperty({
    description:
      'The average population of sentient beings inhabiting this planet.',
  })
  population: string

  /**
   * terrain: The terrain of this planet (string)
   *
   * This property represents the terrain of this planet. It is decorated with
   * `@Column` for database mapping and `@ApiProperty` for Swagger documentation.
   * The description mentions the terrain might be comma-separated if diverse,
   * but the validation doesn't enforce this format.
   */
  @Column()
  @ApiProperty({
    description: 'The terrain of this planet. Comma separated if diverse.',
  })
  terrain: string

  /**
   * surface_water: The percentage of water on the planet surface (string)
   *
   * This property represents the percentage of the planet's surface that is
   * naturally occurring water or bodies of water. It is decorated with `@Column`
   * for database mapping and `@ApiProperty` for Swagger documentation. It might
   * be preferable to store this as a number for calculations, but validation
   * with `@IsString` enforces a string type for now. Consider future improvements
   * for numeric storage.
   */
  @Column()
  @ApiProperty({
    description:
      'The percentage of the planet surface that is naturally occurring water or bodies of water.',
  })
  surface_water: string

  /**
   * residents: People living on this planet (People[] | null) (optional)
   *
   * This property represents an array of `People` entities who live on this planet.
   * It is decorated with `@OneToMany` for a one-to-many relationship with the
   * `People` entity and `@IsOptional` to mark it as optional. `@ApiProperty`
   * provides description and `@JoinTable` is not used for this one-to-many
   * relationship.
   */
  @IsOptional()
  @ApiProperty({
    description: 'An array of People URL Resources that live on this planet.',
  })
  @OneToMany(() => People, (people) => people.homeworld)
  residents?: People[] | null

  /**
   * films: Films the planet appeared in (Film[])
   *
   * This property represents an array of `Film` entities where this planet appeared.
   * It is decorated with `@ManyToMany` for a many-to-many relationship with the
   * `Film` entity and `@ApiProperty` for Swagger documentation. `@JoinTable`
   * specifies the join table name (`films_planets`) for the relationship.
   */
  @ApiProperty({
    description:
      'An array of Film URL Resources that this planet has appeared in.',
  })
  @ManyToMany(() => Film, (films) => films.planets)
  @JoinTable({ name: 'films_planets' })
  films: Film[]

  /**
   * images: Planet images (Image[] | null) (optional)
   *
   * This property represents an array of `Image` entities associated with this planet.
   * It is decorated with `@OneToMany` for a one-to-many relationship with the
   * `Image` entity and `@IsOptional` to mark it as optional. `@ApiProperty`
   * provides description and `@JoinTable` specifies the join table name
   * (`planets_images`) for the relationship.
   */
  @ApiProperty({
    description: 'An array of images resource URLs that are in this person.',
  })
  @OneToMany(() => Image, (image) => image.planets)
  @JoinTable({ name: 'planets_images' })
  images?: Image[]
}
