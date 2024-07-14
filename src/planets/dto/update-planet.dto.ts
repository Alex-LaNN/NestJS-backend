import { PartialType } from '@nestjs/swagger';
import { CreatePlanetDto } from './create-planet.dto';

/**
 * UpdatePlanetDto: DTO for updating a Planet entity
 *
 * This class extends `PartialType(CreatePlanetDto)`, inheriting all properties
 * from `CreatePlanetDto` but making them optional. This allows for partial updates
 * of a `Planet` entity. It is decorated with `@nestjs/swagger`'s `PartialType`
 * utility to achieve partial properties.
 */
export class UpdatePlanetDto extends PartialType(CreatePlanetDto) {}
