import { PartialType } from '@nestjs/swagger'
import { CreateVehicleDto } from './create-vehicle.dto'

/**
 * UpdateVehicleDto
 *
 * This class represents the Data Transfer Object (DTO) for updating an existing vehicle.
 * It extends the `CreateVehicleDto` class, making all properties optional.
 * The `PartialType` function from `@nestjs/swagger` is used to create a type with all
 * properties from `CreateVehicleDto` set to optional, which allows for partial updates.
 */
export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
