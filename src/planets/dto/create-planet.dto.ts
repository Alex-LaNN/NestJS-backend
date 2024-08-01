import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

/**
 * CreatePlanetDto: DTO for creating a new Planet entity
 *
 * This class defines the Data Transfer Object (DTO) used for creating a new
 * `Planet` entity. It utilizes properties with validation decorators from
 * `class-validator` and `ApiProperty` decorator from `@nestjs/swagger` for
 * documentation purposes.
 */
export class CreatePlanetDto {
  /**
   * name: The name of the planet (string)
   *
   * This property represents the name of the planet. It is decorated with
   * `@ApiProperty` for Swagger documentation and
   * `@IsString` for validation to ensure it is a string value.
   */
  @ApiProperty({ description: 'The name of this planet.' })
  @IsString()
  name: string

  /**
   * url (optional): The URL of the planet resource (string)
   *
   * This property represents the URL of the planet resource (if available). It is decorated with:
   *  - `@Exclude` to exclude the property from the class response by default.
   *  - `@ApiHideProperty` to hide it from Swagger documentation.
   *  - `@IsOptional` to indicate it's an optional property.
   *  - `@IsString` to validate that the value is a string if provided.
   */
  @Exclude()
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  url?: string

  /**
   * diameter: The diameter of this planet in kilometers (string)
   *
   * This property represents the diameter of the planet in kilometers. It is
   * currently stored as a string value. It might be preferable to store it as a
   * number for potential calculations, but validation with `@IsString` enforces
   * a string type for now.  Consider future improvements for numeric storage.
   * It is decorated with `@ApiProperty` for Swagger documentation.
   */
  @ApiProperty({ description: 'The diameter of this planet in kilometers.' })
  @IsString()
  diameter: string

  /**
   * rotation_period: The rotation period of this planet (string)
   *
   * This property represents the number of standard hours it takes for this planet
   * to complete a single rotation on its axis. It is currently stored as a string
   * value. It might be beneficial to store it as a number for calculations,
   * but validation with `@IsString` enforces a string type for now. Consider
   * future improvements for numeric storage. It is decorated with `@ApiProperty`
   * for Swagger documentation.
   */
  @ApiProperty({
    description:
      'The number of standard hours it takes for this planet to complete a single rotation on its axis.',
  })
  @IsString()
  rotation_period: string

  /**
   * orbital_period: The orbital period of this planet (string)
   *
   * This property represents the number of standard days it takes for this planet
   * to complete a single orbit of its local star. It is currently stored as a
   * string value. It might be useful to store it as a number for calculations,
   * but validation with `@IsString` enforces a string type for now. Consider
   * future improvements for numeric storage. It is decorated with `@ApiProperty`
   * for Swagger documentation.
   */
  @ApiProperty({
    description:
      'The number of standard days it takes for this planet to complete a single orbit of its local star.',
  })
  @IsString()
  orbital_period: string

  /**
   * gravity: The gravity of this planet (string)
   *
   * This property represents a number denoting the gravity of this planet,
   * where "1" is normal or 1 standard G, "2" is twice or 2 standard Gs, and
   * "0.5" is half or 0.5 standard Gs. It is currently stored as a string value.
   * It might be preferable to store it as a number for calculations, but
   * validation with `@IsString` enforces a string type for now. Consider
   * future improvements for numeric storage. It is decorated with `@ApiProperty`
   * for Swagger documentation.
   */
  @ApiProperty({
    description:
      'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.',
  })
  @IsString()
  gravity: string

  /**
   * population: The population of this planet (string)
   *
   * This property represents the average population of sentient beings inhabiting
   * this planet. It is currently stored as a string value. It might be preferable
   * to store it as a number for calculations, but validation with `@IsString`
   * enforces a string type for now. Consider future improvements for numeric
   * storage. It is decorated with `@ApiProperty` for Swagger documentation.
   */
  @ApiProperty({
    description:
      'The average population of sentient beings inhabiting this planet.',
  })
  @IsString()
  population: string

  /**
   * climate: The climate of this planet (string)
   *
   * This property represents the climate of this planet. It is decorated with
   * `@ApiProperty` for Swagger documentation and `@IsString` for validation to
   * ensure it is a string value. It's mentioned that the climate might be
   * comma-separated if diverse, but the validation doesn't enforce this format.
   */
  @ApiProperty({
    description: 'The climate of this planet. Comma separated if diverse.',
  })
  @IsString()
  climate: string

  /**
   * terrain: The terrain of this planet (string)
   *
   * This property represents the terrain of this planet. It is decorated with
   * `@ApiProperty` for Swagger documentation and `@IsString` for validation to
   * ensure it is a string value. It's mentioned that the terrain might be
   * comma-separated if diverse, but the validation doesn't enforce this format.
   */
  @ApiProperty({
    description: 'The terrain of this planet. Comma separated if diverse.',
  })
  @IsString()
  terrain: string

  /**
   * surface_water: The percentage of water on the planet surface (string)
   *
   * This property represents the percentage of the planet's surface that is
   * naturally occurring water or bodies of water. It is currently stored as a
   * string value. It might be preferable to store it as a number for calculations,
   * but validation with `@IsString` enforces a string type for now. Consider
   * future improvements for numeric storage. It is decorated with `@ApiProperty`
   * for Swagger documentation.
   */
  @ApiProperty({
    description:
      'The percentage of the planet surface that is naturally occurring water or bodies of water.',
  })
  @IsString()
  surface_water: string

  /**
   * residents: People URLs living on this planet (number[])
   *
   * This property represents an array of URLs (currently defined as `number[]`)
   * for people living on this planet. It is decorated with `@ApiProperty` for
   * Swagger documentation and `@IsArray` for validation to ensure it is an array.
   * Note: The type `number[]` might be a mistake; it should likely be `string[]`
   * to store URLs.
   */
  @ApiProperty({
    description: 'An array of People URL Resources that live on this planet.',
  })
  @IsArray()
  residents: string[]

  /**
   * films: Film URLs the planet appeared in (string[])
   *
   * This property represents an array of URLs (currently defined as `string[]`)
   * for films where this planet appeared. It is decorated with `@ApiProperty` for
   * Swagger documentation and `@IsArray` for validation to ensure it is an array.
   */
  @ApiProperty({
    description:
      'An array of Film URL Resources that this planet has appeared in.',
  })
  @IsArray()
  films: string[]
}
