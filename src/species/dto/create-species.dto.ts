import {
  ApiHideProperty,
  ApiProperty,
} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

/**
 * DTO (Data Transfer Object) for creating a new Species entity
 *
 * This class `CreateSpeciesDto` defines the structure for data expected when creating a new Species entity.
 * It utilizes properties decorated with validation decorators from `class-validator` and Swagger documentation decorators
 * from `@nestjs/swagger` to ensure data integrity and provide API documentation.
 */
export class CreateSpeciesDto {
  /**
   * Name of the species
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({ description: 'The name of this species.' })
  @IsString()
  name: string

  /**
   * URL of the species resource (optional)
   *
   * @Exclude - Decorator from `@nestjs/swagger` to exclude the property from the class response by default.
   * This can be useful for properties that are not intended for public consumption.
   *
   * @ApiHideProperty - Decorator from `@nestjs/swagger` to hide the property from Swagger documentation.
   * This helps maintain a clean and focused API documentation.
   *
   * @IsOptional - Decorator (likely custom) to indicate that the property is optional.
   * This provides flexibility in data representation and avoids unnecessary validation errors.
   *
   * @IsString - Decorator from `class-validator` to validate that the property value is a string if provided.
   * This ensures data consistency even for optional properties.
   */
  @Exclude()
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  url?: string

  /**
   * Classification of the species (e.g., mammal, reptile)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description:
      'The classification of this species, such as "mammal" or "reptile".',
  })
  @IsString()
  classification: string

  /**
   * Designation of the species (e.g., sentient)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description: 'The designation of this species, such as "sentient".',
  })
  @IsString()
  designation: string

  /**
   * Average height of the species in centimeters
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description: 'The average height of this species in centimeters.',
  })
  @IsString()
  average_height: string

  /**
   * Average lifespan of the species in years
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description: 'The average lifespan of this species in years.',
  })
  @IsString()
  average_lifespan: string

  /**
   * Common eye colors for the species (comma-separated)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description:
      'A comma-separated string of common eye colors for this species, "none" if this species does not typically have eyes.',
  })
  @IsString()
  eye_colors: string

  /**
   * Common hair colors for the species (comma-separated)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description:
      'A comma-separated string of common hair colors for this species, "none" if this species does not typically have hair.',
  })
  @IsString()
  hair_colors: string

  /**
   * Common skin colors for the species (comma-separated)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({
    description:
      'A comma-separated string of common skin colors for this species, "none" if this species does not typically have skin.',
  })
  @IsString()
  skin_colors: string

  /**
   * Language commonly spoken by the species
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsString - Decorator from `class-validator` to validate that the property is a string.
   */
  @ApiProperty({ description: 'The language commonly spoken by this species.' })
  @IsString()
  language: string

  /**
   * Optional: ID of the planet where the species originated (nullable)
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsOptional - Decorator from `class-validator` to indicate the property is optional.
   * @IsNumber - Not explicitly used here, but could be added to validate the type as a number if desired.
   * nullable: true - Specifies that the property can be null.
   */
  @IsOptional()
  @ApiProperty({
    description: 'Id of the planet from which this species originated.',
    nullable: true,
  })
  homeworld?: number

  /**
   * Array of People URLs that are part of this species
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsArray - Decorator from `class-validator` to validate that the property is an array.
   */
  @ApiProperty({
    description:
      'An array of People URL Resources that are a part of this species.',
  })
  @IsArray()
  people: string[]

  /**
   * Array of Film URLs where this species has appeared
   *
   * @ApiProperty - Decorator from `@nestjs/swagger` to provide API documentation for the property.
   * @IsArray - Decorator from `class-validator` to validate that the property is an array.
   */
  @ApiProperty({
    description:
      'An array of Film URL Resources that this species has appeared in.',
  })
  @IsArray()
  films: string[]
}
