import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsEnum,
  Validate,
} from 'class-validator'
import { EmailValidationService } from 'src/shared/email-validation'
import { UserRoles } from 'src/shared/utils'

/**
 * Data transfer object (DTO) for creating a new user
 *
 * This class defines the structure and validation rules for the data
 * required to create a new user in the system. It includes properties
 * for the username, password, email, and user roles, along with appropriate
 * validation decorators.
 */
export class CreateUserDto {
  /**
   * The username of the user
   *
   * This field represents the username of the user. It must be a non-empty
   * string with a minimum length of 2 characters.
   */
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'The username must contain at least 2 characters.' })
  userName: string

  /**
   * The password of the user
   *
   * This field represents the password of the user. It must be a non-empty
   * string with a minimum length of 5 characters.
   */
  @ApiProperty({ description: 'User password (at least 5 characters).' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'The password must contain at least 5 characters.' })
  password: string

  /**
   * The email address of the user
   *
   * This field represents the email address of the user.
   * It must be a valid email address. Additionally, custom email
   * validation is applied through the `EmailValidationService`.
   */
  @ApiProperty({ description: 'User email.' })
  @Validate(EmailValidationService)
  @IsEmail({}, { message: 'Incorrect email address.' })
  email: string

  /**
   * The role(s) of the user
   *
   * This optional field represents the role(s) assigned to the user. It must
   * be a valid value from the `UserRoles` enum. If not specified, it defaults
   * to `UserRoles.User`.
   */
  @ApiProperty({ default: UserRoles.User })
  @IsEnum(UserRoles)
  roles?: string
}

/**
 * Data transfer object (DTO) for representing a user without password
 *
 * This class extends the `CreateUserDto` but omits the `password` property.
 * It is used for scenarios where user information needs to be exposed
 * without revealing the password.
 */
export class UserWithoutPasswordDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
