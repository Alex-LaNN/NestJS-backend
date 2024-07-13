import { PartialType } from '@nestjs/swagger';
import { CreateFilmDto } from './create-film.dto';

/**
 * UpdateFilmDto: Data Transfer Object for updating an existing film
 *
 * This class inherits from `PartialType(CreateFilmDto)`, making all properties of
 * `CreateFilmDto` optional. This allows for updating specific fields of a film
 * without requiring all fields to be provided.
 */
export class UpdateFilmDto extends PartialType(CreateFilmDto) {}
