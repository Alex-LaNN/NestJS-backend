import { ApiProperty } from '@nestjs/swagger'
import { AbstractEntity } from '../../shared/abstract.entity'
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

/**
 * Film Entity
 *
 * This class represents the `Film` entity stored in the database. It defines
 * the properties of a film within the Star Wars universe and specifies the
 * relationships between this entity and other entities like People, Species,
 * Starship, Vehicle, Planet, and Image. Each property is decorated with
 * TypeORM decorators for database mapping and `@nestjs/swagger`'s `ApiProperty`
 * for API documentation.
 */
@Entity({ name: 'films' })
export class Film extends AbstractEntity<Film> {
  /**
   * title: The title of the film (string)
   *
   * This property represents the title of the film. It is decorated with @Column
   * for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The title of this film.' })
  title: string

  /**
   * url: The hypermedia URL of the film (string)
   *
   * This property represents the hypermedia URL of the film. It is decorated with
   * @Column and @Index for database mapping and indexing, and @ApiProperty
   * for Swagger documentation.
   */
  @Column({ nullable: true })
  @Index()
  @ApiProperty({ description: 'the hypermedia URL of this resource.' })
  url?: string

  /**
   * episode_id: The episode number of the film (number)
   *
   * This property represents the episode number of the film. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The episode number of this film.' })
  episode_id: number

  /**
   * opening_crawl: The opening paragraphs at the beginning of the film (string)
   *
   * This property represents the opening paragraphs at the beginning of the film.
   * It is decorated with @Column (type 'text') for database mapping and
   * @ApiProperty for Swagger documentation.
   *
   */
  @Column({ type: 'text' })
  @ApiProperty({
    description: 'The opening paragraphs at the beginning of this film.',
  })
  opening_crawl: string

  /**
   * director: The name of the director of the film (string)
   *
   * This property represents the name of the director of the film. It is decorated
   * with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'The name of the director of this film.' })
  director: string

  /**
   * producer: The name(s) of the producer(s) of the film (string)
   *
   * This property represents the name(s) of the producer(s) of the film, comma-separated.
   * It is decorated with @Column for database mapping and @ApiProperty for
   * Swagger documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The name(s) of the producer(s) of this film. Comma separated.',
  })
  producer: string

  /**
   * release_date: The release date of the film in ISO 8601 format (Date)
   *
   * This property represents the release date of the film in ISO 8601 format. It is
   * decorated with @Column for database mapping and @ApiProperty for Swagger
   * documentation.
   */
  @Column()
  @ApiProperty({
    description:
      'The ISO 8601 date format of film release at original creator country.',
  })
  release_date: Date

  /**
   * characters: The characters appearing in the film (People[])
   *
   * This property represents an array of `People` entities appearing in the film.
   * It is decorated with @ManyToMany to specify the many-to-many relationship
   * between Film and People entities, @JoinTable to define the join table name,
   * and @ApiProperty for Swagger documentation.
   */
  @ManyToMany(() => People, (people) => people.films)
  @JoinTable({ name: 'people_films' })
  @ApiProperty({
    description: 'An array of people resource URLs that are in this film.',
  })
  characters: People[]

  /**
   * species: The species appearing in the film (Species[])
   *
   * This property represents an array of `Species` entities appearing in the film.
   * It is decorated with @ManyToMany to specify the many-to-many relationship
   * between Film and Species entities, @JoinTable to define the join table name,
   * @ApiProperty for Swagger documentation, and the `cascade` option for
   * automatic persistence.
   */
  @ManyToMany(() => Species, (species) => species.films, { cascade: true })
  @JoinTable({ name: 'films_species' })
  @ApiProperty({
    description: 'An array of species resource URLs that are in this film.',
  })
  species: Species[]

  /**
   * starships: The starships appearing in the film (Starship[])
   *
   * This property represents an array of `Starship` entities appearing in the film.
   * It is decorated with @ManyToMany to specify the many-to-many relationship
   * between Film and Starship entities, @JoinTable to define the join table name,
   * @ApiProperty for Swagger documentation, and the `cascade` option for
   * automatic persistence.
   */
  @ManyToMany(() => Starship, (starships) => starships.films, {
    cascade: true,
  })
  @JoinTable({ name: 'films_starships' })
  @ApiProperty({
    description: 'An array of starship resource URLs that are in this film.',
  })
  starships: Starship[]

  /**
   * vehicles: The vehicles appearing in the film (Vehicle[])
   *
   * This property represents an array of `Vehicle` entities appearing in the film.
   * It is decorated with @ManyToMany to specify the many-to-many relationship
   * between Film and Vehicle entities, @JoinTable to define the join table name,
   * @ApiProperty for Swagger documentation, and the `cascade` option for
   * automatic persistence.
   */
  @ManyToMany(() => Vehicle, (vehicles) => vehicles.films, { cascade: true })
  @JoinTable({ name: 'films_vehicles' })
  @ApiProperty({
    description: 'An array of vehicle resource URLs that are in this film.',
  })
  vehicles: Vehicle[]

  /**
   * planets: The planets appearing in the film (Planet[])
   *
   * This property represents an array of `Planet` entities appearing in the film.
   * It is decorated with @ManyToMany to specify the many-to-many relationship
   * between Film and Planet entities, @JoinTable to define the join table name,
   * @ApiProperty for Swagger documentation, and the `cascade` option for
   * automatic persistence.
   */
  @ManyToMany(() => Planet, (planets) => planets.films, { cascade: true })
  @JoinTable({ name: 'films_planets' })
  @ApiProperty({
    description: 'An array of planet resource URLs that are in this film.',
  })
  planets: Planet[]

  /**
   * images: The images related to the film (Image[] | undefined)
   *
   * This property represents an array of `Image` entities related to the film.
   * It is decorated with @OneToMany to specify the one-to-many relationship
   * between Film and Image entities and @ApiProperty for Swagger documentation.
   * It is optional and can be undefined.
   */
  @OneToMany(() => Image, (images) => images.films)
  @ApiProperty({
    description: 'An array of image resource URLs for this movie.',
  })
  images?: Image[]
}
