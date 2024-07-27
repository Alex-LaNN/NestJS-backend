import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsArray, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'

/**
 * CreateFilmDto: Data Transfer Object for creating a new film
 *
 * This class defines the structure of the data expected when creating a new film.
 * It uses decorators from the `class-validator` package to validate the incoming data.
 * Additionally, it uses decorators from `@nestjs/swagger` to provide API documentation.
 */
export class CreateFilmDto {
  /**
   * title: The title of the film (string)
   *
   * This property represents the title of the film. It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsString` to validate that the property value is a string.
   */
  @ApiProperty({ description: 'The title of this film.' })
  @IsString()
  title: string

  /**
   * url (optional): The URL of the film resource (string)
   *
   * This property represents the URL of the film resource (if available). It is decorated with:
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
   * characters: An array of character resource URLs that are in this film (string[])
   *
   * This property represents an array of URLs referencing characters that appear in the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsArray` to validate that the property value is indeed an array.
   */
  @ApiProperty({
    description: 'An array of people resource URLs that are in this film.',
  })
  @IsArray()
  characters: string[]

  /**
   * episode_id: The episode number of this film (number)
   *
   * This property represents the episode number within the Star Wars universe.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsNumber` to validate that the property value is a number.
   */
  @ApiProperty({
    description: 'The episode number of this film.',
  })
  @IsNumber()
  episode_id: number

  /**
   * opening_crawl: The opening crawl text at the beginning of this film (string)
   *
   * This property represents the opening crawl text that appears at the beginning of the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsString` to validate that the property value is a string.
   */
  @ApiProperty({
    description: 'The opening paragraphs at the beginning of this film.',
  })
  @IsString()
  opening_crawl: string

  /**
   * director: The name of the director of this film (string)
   *
   * This property represents the name of the film's director.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsString` to validate that the property value is a string.
   */
  @ApiProperty({
    description: 'The name of the director of this film.',
  })
  @IsString()
  director: string

  /**
   * producer: The name(s) of the producer(s) of this film (string)
   *
   * This property represents a comma-separated string containing the name(s) of the film's producer(s).
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation, mentioning the comma-separated format.
   *  - `@IsString` to validate that the property value is a string.
   */
  @ApiProperty({
    description:
      'The name(s) of the producer(s) of this film. Comma separated.',
  })
  @IsString()
  producer: string

  /**
   * release_date: The release date of the film (Date)
   *
   * This property represents the release date of the film in ISO 8601 format.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description and an example in Swagger documentation.
   *  - `@IsISO8601` to validate that the property value is a valid ISO 8601 date string.
   */
  @ApiProperty({
    example: '1977-05-25',
    description:
      'The ISO 8601 date format of film release at original creator country.',
  })
  @IsISO8601()
  release_date: Date

  /**
   * species: An array of species resource URLs that are in this film (string[])
   *
   * This property represents an array of URLs referencing species featured in the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsArray` to validate that the property value is indeed an array.
   */
  @ApiProperty({
    description: 'An array of species resource URLs that are in this film.',
  })
  @IsArray()
  species: string[]

  /**
   * starships: An array of starship resource URLs that are in this film (string[])
   *
   * This property represents an array of URLs referencing starships featured in the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsArray` to validate that the property value is indeed an array.
   */
  @ApiProperty({
    description: 'An array of starship resource URLs that are in this film.',
  })
  @IsArray()
  starships: string[]

  /**
   * vehicles: An array of vehicle resource URLs that are in this film (string[])
   *
   * This property represents an array of URLs referencing vehicles featured in the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsArray` to validate that the property value is indeed an array.
   */
  @ApiProperty({
    description: 'An array of vehicle resource URLs that are in this film.',
  })
  @IsArray()
  vehicles: string[]

  /**
   * planets: An array of planet resource URLs that are in this film (string[])
   *
   * This property represents an array of URLs referencing planets featured in the film.
   * It is decorated with:
   *  - `@ApiProperty` to provide a description in Swagger documentation.
   *  - `@IsArray` to validate that the property value is indeed an array.
   */
  @ApiProperty({
    description: 'An array of planet resource URLs that are in this film.',
  })
  @IsArray()
  planets: string[]
}
