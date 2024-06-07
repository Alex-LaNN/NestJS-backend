import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class CreateVehicleDto {
  @ApiProperty({
    description:
      'The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder bike".',
  })
  @IsString()
  name: string

  @ApiProperty({
    description:
      'The model or official name of this vehicle. Such as "All-Terrain Attack Transport".',
  })
  @IsString()
  model: string

  @ApiProperty({
    description:
      'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".',
  })
  @IsString()
  vehicle_class: string

  @ApiProperty({
    description:
      'The manufacturer of this vehicle. Comma separated if more than one.',
  })
  @IsString()
  manufacturer: string

  @ApiProperty({
    description: ' The length of this vehicle in meters.',
  })
  @IsString()
  length: string

  @ApiProperty({
    description: 'The cost of this vehicle new, in Galactic Credits.',
  })
  @IsString()
  cost_in_credits: string

  @ApiProperty({
    description: 'The number of personnel needed to run or pilot this vehicle.',
  })
  @IsString()
  crew: string

  @ApiProperty({
    description:
      'The number of non-essential people this vehicle can transport.',
  })
  @IsString()
  passengers: string

  @ApiProperty({
    description: 'The maximum speed of this vehicle in the atmosphere.',
  })
  @IsString()
  max_atmosphering_speed: string

  @ApiProperty({
    description:
      'The maximum number of kilograms that this vehicle can transport.',
  })
  @IsString()
  cargo_capacity: string

  @ApiProperty({
    description:
      'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.',
  })
  @IsString()
  consumables: string

  @ApiProperty({
    description:
      'An array of Film URL Resources that this vehicle has appeared in.',
  })
  @IsArray()
  films: string[]

  @ApiProperty({
    description:
      'An array of People URL Resources that this vehicle has been piloted by.',
  })
  @IsArray()
  pilots: string[]

  @ApiProperty({
    description: 'An array of images resource URLs for this vehicle.',
  })
  @IsArray()
  images: string[]
}
