import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

/**
 * CreateVehicleDto
 *
 * This class represents the Data Transfer Object (DTO) for creating a new vehicle.
 * It defines the properties that must be provided when creating a vehicle and
 * uses various decorators to manage API documentation and data validation.
 */
export class CreateVehicleDto {
  /**
   * name
   *
   * This property represents the common name of the vehicle (e.g., "Sand Crawler", "Speeder bike").
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the name must be a string.
   */
  @ApiProperty({
    description:
      'The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".',
  })
  @IsString()
  name: string

  /**
   * url (optional)
   *
   * This property represents the URL of the vehicle resource (if available).
   * It is decorated with `@Exclude` to exclude it from the class response by default,
   * `@ApiHideProperty` to hide it from Swagger documentation,
   * `@IsOptional` to indicate it's an optional property,
   * and `@IsString` to validate that the value is a string if provided.
   */
  @Exclude()
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  url?: string

  /**
   * model
   *
   * This property represents the model or official name of the vehicle (e.g., "All-Terrain Attack Transport").
   * It is decorated with `@ApiProperty` and `@IsString` for documentation and validation.
   */
  @ApiProperty({
    description:
      'The model or official name of this vehicle. Such as "All-Terrain Attack Transport".',
  })
  @IsString()
  model: string

  /**
   * vehicle_class
   *
   * This property represents the class of the vehicle (e.g., "Wheeled", "Repulsorcraft").
   * It is decorated with `@ApiProperty` and `@IsString` for documentation and validation.
   */
  @ApiProperty({
    description:
      'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".',
  })
  @IsString()
  vehicle_class: string

  /**
   * manufacturer
   *
   * This property represents the manufacturer(s) of this vehicle. It can include
   * multiple manufacturers separated by commas. It is decorated with `@ApiProperty`
   * for Swagger documentation, specifying a description and indicating that the
   * manufacturer information must be a string.
   */
  @ApiProperty({
    description:
      'The manufacturer of this vehicle. Comma separated if more than one.',
  })
  @IsString()
  manufacturer: string

  /**
   * length
   *
   * This property represents the length of this vehicle in meters. It is decorated
   * with `@ApiProperty` for Swagger documentation, specifying a description and
   * indicating that the length must be a string value (potentially representing
   * a number). However, additional validation might be required to ensure a valid
   * numerical format for the length.
   */
  @ApiProperty({
    description: ' The length of this vehicle in meters.',
  })
  @IsString()
  length: string

  /**
   * cost_in_credits
   *
   * This property represents the cost of this vehicle when new, in Galactic Credits.
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a
   * description and indicating that the cost must be a string value (potentially
   * representing a number). However, additional validation might be required to ensure
   * a valid numerical format for the cost.
   */
  @ApiProperty({
    description: 'The cost of this vehicle new, in Galactic Credits.',
  })
  @IsString()
  cost_in_credits: string

  /**
   * crew
   *
   * This property represents the number of personnel needed to run or pilot this vehicle.
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a
   * description and indicating that the crew size must be a string value (potentially
   * representing a number). However, additional validation might be required to ensure
   * a valid numerical format for the crew size.
   */
  @ApiProperty({
    description: 'The number of personnel needed to run or pilot this vehicle.',
  })
  @IsString()
  crew: string

  /**
   * passengers
   *
   * This property represents the number of non-essential people this vehicle can transport.
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the passenger capacity must be a string value (potentially representing
   * a number). However, additional validation might be required to ensure a valid numerical format
   * for the passenger capacity.
   */
  @ApiProperty({
    description:
      'The number of non-essential people this vehicle can transport.',
  })
  @IsString()
  passengers: string

  /**
   * max_atmosphering_speed
   *
   * This property represents the maximum speed of this vehicle in the atmosphere.
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the maximum speed must be a string value (potentially representing
   * a unit of measurement and a numerical value). However, additional validation might be required
   * to ensure a valid format for the speed (e.g., "100 km/h").
   */
  @ApiProperty({
    description: 'The maximum speed of this vehicle in the atmosphere.',
  })
  @IsString()
  max_atmosphering_speed: string

  /**
   * cargo_capacity
   *
   * This property represents the maximum number of kilograms that this vehicle can transport.
   * It is decorated with `@ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the cargo capacity must be a string value (potentially representing
   * a number). However, additional validation might be required to ensure a valid numerical format
   * for the cargo capacity.
   */
  @ApiProperty({
    description:
      'The maximum number of kilograms that this vehicle can transport.',
  })
  @IsString()
  cargo_capacity: string

  /**
   * consumables
   *
   * This property represents the maximum length of time that this vehicle can provide consumables
   * for its entire crew without having to resupply. It is decorated with `@ApiProperty` for Swagger
   * documentation, specifying a description and indicating that the consumables duration must be a
   * string value (potentially representing a unit of time and a numerical value). However,
   * additional validation might be required to ensure a valid format for the duration (e.g., "7 days").
   */
  @ApiProperty({
    description:
      'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.',
  })
  @IsString()
  consumables: string

  /**
   * films
   *
   * This property represents an array of film URLs where this vehicle has appeared.
   * It is decorated with `@ApiProperty` and `@IsArray` for documentation and validation.
   */
  @ApiProperty({
    description:
      'An array of Film URL Resources that this vehicle has appeared in.',
  })
  @IsArray()
  films: string[]

  /**
   * pilots
   *
   * This property represents an array of people URLs who have piloted this vehicle.
   * It is decorated with `@ApiProperty` and `@IsArray` for documentation and validation.
   */
  @ApiProperty({
    description:
      'An array of People URL Resources that this vehicle has been piloted by.',
  })
  @IsArray()
  pilots: string[]
}
