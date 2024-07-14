import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

/**
 * CreateStarshipDto class
 *
 * This class represents the data transfer object (DTO) used for creating new starship entities.
 * It defines the properties that are required for creating a starship record in the application.
 * These properties are mapped to the corresponding database schema fields.
 */
export class CreateStarshipDto {
  /**
   * Name of the starship (e.g., "Death Star")
   *
   * @ApiProperty decorator provides metadata for OpenAPI documentation using Swagger.
   * The description property specifies the description of the property in the documentation.
   * @IsString decorator from class-validator validates that the property value is a string.
   */
  @ApiProperty({
    description:
      'The name of this starship. The common name, such as "Death Star".',
  })
  @IsString()
  name: string

  /**
   * Model or official name of the starship (e.g., "T-65 X-wing")
   *
   * @ApiProperty decorator provides metadata for OpenAPI documentation using Swagger.
   * The description property specifies the description of the property in the documentation.
   * @IsString decorator from class-validator validates that the property value is a string.
   */
  @ApiProperty({
    description:
      'The model or official name of this starship. Such as "T-65 X-wing" or "DS-1 Orbital Battle Station".',
  })
  @IsString()
  model: string

  /**
   * Represents the class of this starship.
   *
   * This property holds the class type of the starship, such as "Starfighter"
   * or "Deep Space Mobile Battlestation". It is decorated with
   * @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({
    description:
      'The class of this starship, such as "Starfighter" or "Deep Space Mobile Battlestation".',
  })
  @IsString()
  starship_class: string

  /**
   * Manufacturer of the starship (comma separated if more than one)
   *
   * @ApiProperty describes the property for Swagger documentation.
   * The description property specifies the description of the property in the documentation.
   * @IsString validates that the property value is a string.
   */
  @ApiProperty({
    description:
      'The manufacturer of this starship. Comma separated if more than one.',
  })
  @IsString()
  manufacturer: string

  /**
   * Cost of the starship new, in galactic credits
   *
   * @ApiProperty describes the property for Swagger documentation.
   * The description property specifies the description of the property in the documentation.
   * @IsString validates that the property value is a string.
   */
  @ApiProperty({
    description: 'The cost of this starship new, in galactic credits.',
  })
  @IsString()
  cost_in_credits: string

  /**
   * Length of this starship in meters
   *
   * @ApiProperty describes the property for Swagger documentation.
   * The description property specifies the description of the property in the documentation.
   * @IsString validates that the property value is a string.
   */
  @ApiProperty({ description: 'The length of this starship in meters.' })
  @IsString()
  length: string

  /**
   * Number of personnel needed to run or pilot this starship
   *
   * @ApiProperty describes the property for Swagger documentation.
   * The description property specifies the description of the property in the documentation.
   * @IsString validates that the property value is a string.
   */
  @ApiProperty({
    description:
      'The number of personnel needed to run or pilot this starship.',
  })
  @IsString()
  crew: string

  /**
   * Number of non-essential people this starship can transport
   *
   * @ApiProperty describes the property for Swagger documentation.
   * The description property specifies the description of the property in the documentation.
   * @IsString validates that the property value is a string.
   */
  @ApiProperty({
    description:
      ' The number of non-essential people this starship can transport.',
  })
  @IsString()
  passengers: string

  /**
   * Represents the maximum speed of this starship in the atmosphere.
   *
   * This property holds the maximum speed this starship can achieve while
   * in the atmosphere. If the starship is incapable of atmospheric flight,
   * it is set to "N/A". It is decorated with
   * @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({
    description:
      'The maximum speed of this starship in the atmosphere. "N/A" if this starship is incapable of atmospheric flight.',
  })
  @IsString()
  max_atmosphering_speed: string

  /**
   * Represents the hyperdrive rating of this starship.
   *
   * This property holds the class of the hyperdrive installed on the starship.
   * It is decorated with @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({ description: 'The class of this starships hyperdrive.' })
  @IsString()
  hyperdrive_rating: string

  /**
   * Represents the maximum number of Megalights this starship can travel in a standard hour.
   *
   * This property holds the value for the maximum number of Megalights this starship
   * can travel in a standard hour. A "Megalight" is a standard unit of distance and
   * has not been defined within the Star Wars universe. It is used for measuring
   * the speed difference of starships and is assumed to be similar to AU, the distance
   * between the Sun (Sol) and Earth.
   * It is decorated with @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({
    description:
      'The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.',
  })
  @IsString()
  MGLT: string

  /**
   * Represents the maximum cargo capacity of this starship.
   *
   * This property holds the maximum weight, in kilograms, that this starship
   * can transport.
   * It is decorated with @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({
    description:
      'The maximum number of kilograms that this starship can transport.',
  })
  @IsString()
  cargo_capacity: string

  /**
   * Represents the maximum duration the starship can provide consumables for its entire crew.
   *
   * This property holds the maximum length of time, such as weeks, months, or years,
   * that this starship can provide consumables for its entire crew without needing
   * to resupply.
   * It is decorated with @ApiProperty for API documentation and
   * @IsString for validation.
   */
  @ApiProperty({
    description:
      'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.',
  })
  @IsString()
  consumables: string

  /**
   * Array of film URLs where the starship appeared
   *
   * @ApiProperty describes the property for Swagger documentation.
   * @IsArray validates that the property is an array.
   */
  @ApiProperty({
    description:
      'An array of Film URL Resources that this starship has appeared in.',
  })
  @IsArray()
  films: string[]

  /**
   * Array of people URLs who piloted the starship
   *
   * @ApiProperty describes the property for Swagger documentation.
   * @IsArray validates that the property is an array.
   */
  @ApiProperty({
    description:
      'An array of People URL Resources that this starship has been piloted by.',
  })
  @IsArray()
  pilots: string[]
}
