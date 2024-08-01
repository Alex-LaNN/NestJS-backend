import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'

/**
 * Data transfer object (DTO) for updating a user
 *
 * This class extends the `CreateUserDto` and makes all its properties optional,
 * allowing partial updates of user information. It is used in scenarios where
 * only specific fields of a user need to be updated.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
