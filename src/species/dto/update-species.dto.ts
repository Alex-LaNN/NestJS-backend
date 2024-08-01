import { PartialType } from '@nestjs/swagger'
import { CreateSpeciesDto } from './create-species.dto'

/**
 * DTO (Data Transfer Object) for updating a Species entity
 *
 * This class `UpdateSpeciesDto` extends `PartialType` of `CreateSpeciesDto`.
 * It allows for partial updates of a Species entity by inheriting the properties from `CreateSpeciesDto`
 * but making them all optional. This means that only the properties included in the request body will be updated.
 */
export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) {}
