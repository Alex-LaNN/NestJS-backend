import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsISO8601, IsNumber, IsString } from 'class-validator'

export class CreateFilmDto {
  @ApiProperty({ description: 'The title of this film.' })
  @IsString()
  title: string

  @ApiProperty({
    description: 'An array of people resource URLs that are in this film.',
  })
  @IsArray()
  characters: string[]

  @ApiProperty({
    description: 'The episode number of this film.',
  })
  @IsNumber()
  episode_id: number

  @ApiProperty({
    description: 'The opening paragraphs at the beginning of this film.',
  })
  @IsString()
  opening_crawl: string

  @ApiProperty({
    description: 'The name of the director of this film.',
  })
  @IsString()
  director: string

  @ApiProperty({
    description:
      'The name(s) of the producer(s) of this film. Comma separated.',
  })
  @IsString()
  producer: string

  @ApiProperty({
    example: '1977-05-25',
    description:
      'The ISO 8601 date format of film release at original creator country.',
  })
  @IsISO8601()
  release_date: Date

  @ApiProperty({
    description: 'An array of species resource URLs that are in this film.',
  })
  @IsArray()
  species: string[]

  @ApiProperty({
    description: 'An array of starship resource URLs that are in this film.',
  })
  @IsArray()
  starships: string[]

  @ApiProperty({
    description: 'An array of vehicle resource URLs that are in this film.',
  })
  @IsArray()
  vehicles: string[]

  @ApiProperty({
    description: 'An array of planet resource URLs that are in this film.',
  })
  @IsArray()
  planets: string[]

  @ApiProperty({
    description: 'An array of images resource URLs for this film.',
  })
  @IsArray()
  images: string[]
}
