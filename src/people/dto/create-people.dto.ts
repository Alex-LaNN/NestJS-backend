import { IsArray, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * CreatePeopleDto: Data Transfer Object for creating a new person
 *
 * This class defines the data structure expected for creating a new person
 * resource. It uses class-validator decorators to validate the data types
 * and Swagger's `@ApiProperty` decorator to provide API documentation.
 */
export class CreatePeopleDto {
  /**
   * name: The name of the person (string)
   *
   * This property represents the name of the person. It is decorated with
   * `@IsString` to ensure it receives a string value. Additionally,
   * `@ApiProperty` provides a description for Swagger documentation.
   */
  @ApiProperty({ description: 'The name of this person.' })
  @IsString()
  name: string

  /**
   * birth_year: The birth year of the person (string)
   *
   * This property represents the birth year of the person using the in-universe
   * standard of BBY or ABY (Before the Battle of Yavin or After the Battle
   * of Yavin).
   * It is decorated with `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin.',
  })
  @IsString()
  birth_year: string

  /**
   * eye_color: The eye color of the person (string)
   *
   * This property represents the eye color of the person. It can be a specific
   * color value, "unknown" if the information is not available, or "n/a" if the
   * person does not have eyes.
   * It is decorated with `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.',
  })
  @IsString()
  eye_color: string

  /**
   * height: The height of the person in centimeters (string)
   *
   * This property represents the height of the person in centimeters. It is
   * stored as a string value, although it could potentially be converted to a
   * number for calculations if needed.
   * It is decorated with `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({ description: 'The height of the person in centimeters.' })
  @IsString()
  height: string

  /**
   * mass: The mass of the person in kilograms (string)
   *
   * This property represents the mass of the person in kilograms. It is stored
   * as a string value, although it could potentially be converted to a number
   * for calculations if needed.
   * It is decorated with `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({ description: 'The mass of the person in kilograms.' })
  @IsString()
  mass: string

  /**
   * hair_color: The hair color of the person (string)
   *
   * This property represents the hair color of the person. It can be a specific
   * color value, "unknown" if the information is not available, or "n/a" if the
   * person does not have hair.
   * It is decorated with `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.',
  })
  @IsString()
  hair_color: string

  /**
   * skin_color: The skin color of the person (string)
   *
   * This property represents the skin color of the person. It is decorated with
   * `@IsString` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({ description: 'The skin color of this person.' })
  @IsString()
  skin_color: string

  /**
   * gender: The gender of the person (string)
   *
   * This property represents the gender of the person. It can be "Male",
   * "Female", "unknown", or "n/a" if the person's gender is not specified. It is
   * decorated with `@IsString` for validation and `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.',
  })
  @IsString()
  gender: string

  /**
   * homeworld: ID of the planet the person is from (optional, number)
   *
   * This property represents the ID of the planet where the person was born
   * or inhabits. It is decorated with `@IsOptional` to indicate it's optional
   * and `@ApiProperty` for description.
   */
  @IsOptional()
  @ApiProperty({
    description: 'Id of the planet this person was born on or inhabits.',
    nullable: true,
  })
  homeworld?: number

  /**
   * films: Array of film resource URLs (string[])
   *
   * This property represents an array of URLs referencing films where this
   * person appeared. It is decorated with `@IsArray` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description: 'An array of film resource URLs that this person has been in.',
  })
  @IsArray()
  films: string[]

  /**
   * species: Array of species resource URLs (string[])
   *
   * This property represents an array of URLs referencing species that this
   * person belongs to. It is decorated with `@IsArray` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'An array of species resource URLs that this person belongs to',
  })
  @IsArray()
  species: string[]

  /**
   * vehicles: Array of vehicle resource URLs (string[])
   *
   * This property represents an array of URLs referencing vehicles that this
   * person has piloted. It is decorated with `@IsArray` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'An array of vehicle resource URLs that this person has piloted.',
  })
  @IsArray()
  vehicles: string[]

  /**
   * starships: Array of starship resource URLs (string[])
   *
   * This property represents an array of URLs referencing starships that this
   * person has piloted. It is decorated with `@IsArray` for validation and
   * `@ApiProperty` for description.
   */
  @ApiProperty({
    description:
      'An array of starship resource URLs that this person has piloted.',
  })
  @IsArray()
  starships: string[]
}
