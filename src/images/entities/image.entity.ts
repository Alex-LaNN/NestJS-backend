import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { People } from '../../people/entities/people.entity'
import { Film } from '../../films/entities/film.entity'
import { Planet } from '../../planets/entities/planet.entity'
import { Starship } from '../../starships/entities/starship.entity'
import { Vehicle } from '../../vehicles/entities/vehicle.entity'
import { Species } from '../../species/entities/species.entity'

/**
 * Image Entity: Represents an image resource in the database
 *
 * This entity represents an image stored in the system. It has properties
 * like `id`, `name`, `description`, and `url` to store information about
 * the image itself. Additionally, it has relationships with other entities
 * using `@ManyToOne` decorators from TypeORM. These relationships allow
 * for associating images with specific People, Films, Planets, Starships,
 * Vehicles, or Species resources.
 */
@Entity({ name: 'images' })
export class Image {
  /**
   * id: The identification number of the image (number)
   *
   * This property represents the unique identifier for the image. It is decorated
   * with @PrimaryGeneratedColumn for database auto-generation and @ApiProperty
   * for Swagger documentation.
   */
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Image identification number.' })
  id: number

  /**
   * name: The unique name of the image (string)
   *
   * This property represents the unique name assigned to the image. It is decorated
   * with @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'Unique name of this image.' })
  name: string

  /**
   * description: The description of the image (string)
   *
   * This property represents the description of the image. It is decorated with
   * @Column for database mapping and @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'Description of the image.' })
  description: string

  /**
   * url: The URL address of the image storage location (string)
   *
   * This property represents the URL address where the image is stored.
   * It is decorated with @Column for database mapping and
   * @ApiProperty for Swagger documentation.
   */
  @Column()
  @ApiProperty({ description: 'URL address of the image storage location.' })
  url: string

  /**
   * people: The People resource featured in this image (People)
   *
   * This property represents the ID of the People resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and People entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => People, (people) => people.images)
  @ApiProperty({
    description: 'The ID of the People resource featured in this image.',
  })
  people: People

  /**
   * films: The Film resource featured in this image (Film)
   *
   * This property represents the ID of the Film resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and Film entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => Film, (films) => films.images)
  @ApiProperty({
    description: 'The ID of the Film resource featured in this image.',
  })
  films: Film

  /**
   * planets: The Planet resource featured in this image (Planet)
   *
   * This property represents the ID of the Planet resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and Planet entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => Planet, (planets) => planets.images)
  @ApiProperty({
    description: 'The ID of the Planet resource featured in this image.',
  })
  planets: Planet

  /**
   * starships: The Starship resource featured in this image (Starship)
   *
   * This property represents the ID of the Starship resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and Starship entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => Starship, (starships) => starships.images)
  @ApiProperty({
    description: 'The ID of the Starship resource featured in this image.',
  })
  starships: Starship

  /**
   * vehicles: The Vehicle resource featured in this image (Vehicle)
   *
   * This property represents the ID of the Vehicle resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and Vehicle entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => Vehicle, (vehicles) => vehicles.images)
  @ApiProperty({
    description: 'The ID of the Vehicle resource featured in this image.',
  })
  vehicles: Vehicle

  /**
   * species: The Species resource featured in this image (Species)
   *
   * This property represents the ID of the Species resource featured in this image.
   * It is decorated with @ManyToOne to specify the many-to-one relationship
   * between Image and Species entities and @ApiProperty for Swagger documentation.
   */
  @ManyToOne(() => Species, (species) => species.images)
  @ApiProperty({
    description: 'The ID of the Species resource featured in this image.',
  })
  species: Species
}
