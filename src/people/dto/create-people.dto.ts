import { IsArray, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePeopleDto {
  @ApiProperty({ description: 'The name of this person.' })
  @IsString()
  name: string

  @ApiProperty({
    description:
      'The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin.',
  })
  @IsString()
  birth_year: string

  @ApiProperty({
    description:
      'The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.',
  })
  @IsString()
  eye_color: string

  @ApiProperty({ description: 'The height of the person in centimeters.' })
  @IsString()
  height: string

  @ApiProperty({ description: 'The mass of the person in kilograms.' })
  @IsString()
  mass: string

  @ApiProperty({
    description:
      'The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.',
  })
  @IsString()
  hair_color: string

  @ApiProperty({ description: 'The skin color of this person.' })
  @IsString()
  skin_color: string

  @ApiProperty({
    description:
      'The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.',
  })
  @IsString()
  gender: string

  @ApiProperty({
    description:
      'The URL of a planet resource, a planet that this person was born on or inhabits.',
  })
  @IsString()
  homeworld: string

  @ApiProperty({
    description: 'An array of film resource URLs that this person has been in.',
  })
  @IsArray()
  films: string[]

  @ApiProperty({
    description:
      'An array of species resource URLs that this person belongs to',
  })
  @IsArray()
  species: string[]

  @ApiProperty({
    description:
      'An array of vehicle resource URLs that this person has piloted.',
  })
  @IsArray()
  vehicles: string[]

  @ApiProperty({
    description:
      'An array of starship resource URLs that this person has piloted.',
  })
  @IsArray()
  starships: string[]
}
