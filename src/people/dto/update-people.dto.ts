import { PartialType } from '@nestjs/mapped-types';
import { CreatePeopleDto } from './create-people.dto';

/**
 * UpdatePeopleDto: Data Transfer Object for updating a person
 *
 * This class inherits from `CreatePeopleDto` using NestJS's `PartialType`
 * utility. This means that `UpdatePeopleDto` includes all the properties from
 * `CreatePeopleDto`, but they are all optional. This allows for partial updates
 * of person information where only the provided fields will be updated.
 */
export class UpdatePeopleDto extends PartialType(CreatePeopleDto) {}
