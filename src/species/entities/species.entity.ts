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
import { Image } from '../../images/entities/image.entity'
import { Planet } from '../../planets/entities/planet.entity'
import { IsOptional } from 'class-validator'

/**
 * Entity class representing a Species in the Star Wars universe
 *
 * This class `Species` defines the database schema for a species in the Star Wars universe.
 * It extends the `AbstractEntity` class and utilizes various TypeORM decorators to map properties to database columns and relationships.
 * It also utilizes decorators from `@nestjs/swagger` to provide API documentation for the properties.
 */
@Entity({ name: 'species' })
export class Species extends AbstractEntity<Species> {
  /**
   * Name of the species
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({ description: 'The name of this species.' })
  name: string

  /**
   * URL of the species resource (optional)
   *
   * @Column({ nullable: true }) - TypeORM decorator to map this property to a database column.
   * The `nullable: true` option allows storing null values for this column.
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * This decorator specifies a description for the property in the Swagger documentation.
   */
  @Column({ nullable: true })
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url?: string

  /**
   * Classification of the species (e.g., mammal, reptile)
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description:
      'The classification of this species, such as "mammal" or "reptile".',
  })
  classification: string

  /**
   * Designation of the species (e.g., sentient)
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description: 'The designation of this species, such as "sentient".',
  })
  designation: string

  /**
   * Average height of the species in centimeters
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description: 'The average height of this species in centimeters.',
  })
  average_height: string

  /**
   * Average lifespan of the species in years
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description: 'The average lifespan of this species in years.',
  })
  average_lifespan: string

  /**
   * Comma-separated string of common eye colors for the species
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common eye colors for this species, "none" if this species does not typically have eyes.',
  })
  eye_colors: string

  /**
   * Comma-separated string of common hair colors for the species
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common hair colors for this species, "none" if this species does not typically have hair.',
  })
  hair_colors: string

  /**
   * Comma-separated string of common skin colors for the species
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description:
      'A comma-separated string of common skin colors for this species, "none" if this species does not typically have skin.',
  })
  skin_colors: string

  /**
   * Language commonly spoken by the species
   *
   * @Column - TypeORM decorator to map this property to a database column.
   * @ApiProperty - Decorator from `@nestjs/swagger` to define API documentation for the property.
   */
  @Column()
  @ApiProperty({
    description: ' The language commonly spoken by this species.',
  })
  language: string

  /**
   * Optional: Planet where the species originated from (one-to-one relationship)
   *
   * @IsOptional - Decorator from `class-validator` to indicate the property is optional.
   * @OneToOne - TypeORM decorator to define a one-to-one relationship with the Planet entity.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @JoinColumn - TypeORM decorator to specify the join column for the relationship.
   * homeworld?: Planet | null - Optional property that can hold a Planet entity or null.
   */
  @IsOptional()
  @OneToOne(() => Planet, (planets) => planets.id)
  @ApiProperty({
    description:
      'The URL of a planet resource, a planet that this species originates from.',
  })
  @JoinColumn()
  homeworld?: Planet | null

  /**
   * Many-to-many relationship with People entities (species a person belongs to)
   *
   * @ManyToMany - TypeORM decorator to define a many-to-many relationship with the People entity.
   * @JoinTable - TypeORM decorator to specify the join table name for the relationship.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * people: People[] - Array of People entities that belong to this species.
   */
  @ManyToMany(() => People, (people) => people.species)
  @JoinTable({ name: 'people_species' })
  @ApiProperty({
    description:
      'An array of People URL Resources that are a part of this species.',
  })
  people: People[]

  /**
   * Many-to-many relationship with Film entities (films a species has appeared in)
   *
   * @ManyToMany - TypeORM decorator to define a many-to-many relationship with the Film entity.
   * @JoinTable - TypeORM decorator to specify the join table name for the relationship.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * films: Film[] - Array of Film entities where this species has appeared.
   */
  @ManyToMany(() => Film, (films) => films.species)
  @JoinTable({ name: 'films_species' })
  @ApiProperty({
    description:
      'An array of Film URL Resources that this species has appeared in.',
  })
  films: Film[]

  /**
   * One-to-many relationship with Image entities (images of this species)
   *
   * @OneToMany - TypeORM decorator to define a one-to-many relationship with the Image entity.
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @JoinTable - TypeORM decorator to specify the join table name for the relationship (optional for one-to-many).
   * images?: Image[] - Optional array of Image entities associated with this species.
   */
  @OneToMany(() => Image, (images) => images.species)
  @ApiProperty({
    description: 'An array of image resource URLs for this species.',
  })
  images?: Image[]
}
