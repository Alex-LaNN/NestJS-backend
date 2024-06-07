import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class CreatePlanetDto {
  @ApiProperty({ description: 'The name of this planet.' })
  @IsString()
  name: string

  @ApiProperty({ description: 'The diameter of this planet in kilometers.' })
  @IsString()
  diameter: string

  @ApiProperty({
    description:
      'The number of standard hours it takes for this planet to complete a single rotation on its axis.',
  })
  @IsString()
  rotation_period: string

  @ApiProperty({
    description:
      'The number of standard days it takes for this planet to complete a single orbit of its local star.',
  })
  @IsString()
  orbital_period: string

  @ApiProperty({
    description:
      'A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.',
  })
  @IsString()
  gravity: string

  @ApiProperty({
    description:
      'The average population of sentient beings inhabiting this planet.',
  })
  @IsString()
  population: string

  @ApiProperty({
    description: 'The climate of this planet. Comma separated if diverse.',
  })
  @IsString()
  climate: string

  @ApiProperty({
    description: 'The terrain of this planet. Comma separated if diverse.',
  })
  @IsString()
  terrain: string

  @ApiProperty({
    description:
      'The percentage of the planet surface that is naturally occurring water or bodies of water.',
  })
  @IsString()
  surface_water: string

  @ApiProperty({
    description: 'An array of People URL Resources that live on this planet.',
  })
  @IsArray()
  residents: string[]

  @ApiProperty({
    description:
      'An array of Film URL Resources that this planet has appeared in.',
  })
  @IsArray()
  films: string[]

  @ApiProperty({
    description: 'An array of images resource URLs for this planet.',
  })
  @IsArray()
  images: string[]
}
