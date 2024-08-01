import { PartialType } from '@nestjs/swagger'
import { CreateStarshipDto } from './create-starship.dto'

/**
 * UpdateStarshipDto class
 *
 * This class is used for updating starship data. It extends `PartialType`
 * from `@nestjs/swagger` and uses `CreateStarshipDto` as a base.
 * By extending `PartialType`, all fields from `CreateStarshipDto` become optional,
 * making it suitable for update operations where not all fields need to be provided.
 */
export class UpdateStarshipDto extends PartialType(CreateStarshipDto) {}
