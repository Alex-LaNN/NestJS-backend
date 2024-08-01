import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsUUID } from 'class-validator'
import { LoginUserDto } from 'src/auth/dto/login-user.dto'
import { UserRoles } from 'src/shared/constants'

/**
 * Data transfer object (DTO) for user response
 *
 * This class extends the `LoginUserDto` and adds additional properties
 * that are returned in the response when user information is fetched.
 */
export class UserResponseDto extends LoginUserDto {
  /**
   * User ID (UUID)
   *
   * @type {string}
   */
  @ApiProperty()
  @IsUUID()
  id: string

  /**
   * Username
   *
   * @type {string}
   */
  @ApiProperty()
  @IsString()
  userName: string

  /**
   * User email
   *
   * @type {string}
   * @readonly
   */
  @ApiProperty()
  @IsEmail()
  readonly email: string

  /**
   * User roles
   *
   * @type {UserRoles[]}
   * @readonly
   */
  @ApiProperty()
  readonly roles: UserRoles[]
}
