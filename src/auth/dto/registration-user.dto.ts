import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator'
import { EmailValidationService } from 'src/shared/email-validation'
import { MatchValidator } from 'src/shared/password-validation'
import { UserRoles } from 'src/shared/constants'

/**
 * RegistrationUserDto: Registration DTO for user creation
 *
 * This class defines the structure of the DTO (Data Transfer Object) used for user registration.
 * It specifies the expected properties and validation rules for user information during registration.
 */
export class RegistrationUserDto {
  /**
   * Username (minimum length of 2 characters)
   *
   * This property represents the username for the new user. It is decorated with:
   *   - `@ApiProperty({ description: 'User name', minLength: 2 })`: Provides a description and minimum length in Swagger API documentation.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   *   - `@IsString()`: Ensures the value is a string.
   *   - `@MinLength(2)`: Ensures the username has at least 2 characters.
   */
  @ApiProperty({ description: 'User name', minLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  userName: string

  /**
   * User Email
   *
   * This property represents the user's email address for registration. It is decorated with:
   *   - `@ApiProperty({ description: 'User email' })`: Provides a description in Swagger API documentation.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   *   - `@Validate(EmailValidationService)`: Uses a custom validation service (`EmailValidationService`) to validate the email format.
   */
  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @Validate(EmailValidationService)
  email: string

  /**
   * User Password (minimum length of 4 characters)
   *
   * This property represents the user's password for registration. It is decorated with:
   *   - `@ApiProperty({ description: 'User password', minLength: 4 })`: Provides a description and minimum length in Swagger API documentation.
   *   - `@IsString()`: Ensures the value is a string.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   *   - `@MinLength(4)`: Ensures the password has at least 4 characters.
   */
  @ApiProperty({ description: 'User password', minLength: 4 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string

  /**
   * Repeated Password (must match password)
   *
   * This property represents the repeated password for confirmation during registration. It is decorated with:
   *   - `@ApiProperty({ description: 'Repeated password' })`: Provides a description in Swagger API documentation.
   *   - `@IsString()`: Ensures the value is a string.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   *   - `@Validate(MatchValidator, ['password'])`: Uses a custom validation service (`MatchValidator`) to ensure the repeated password matches the original password.
   */
  @ApiProperty({ description: 'Repeated password' })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchValidator, ['password'])
  repeatedPasword: string

  /**
   * User Role (default: User)
   *
   * This property represents the user's role (optional). It is decorated with:
   *   - `@ApiProperty({ enum: UserRoles, default: UserRoles.User })`: Provides an enum description and default value in Swagger API documentation.
   *   - `@IsEnum(UserRoles)`: Ensures the value is one of the valid roles defined in the `UserRoles` enum.
   */
  @ApiProperty({ enum: UserRoles, default: UserRoles.User })
  @IsEnum(UserRoles)
  role?: UserRoles
}
