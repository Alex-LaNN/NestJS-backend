import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

/**
 * LoginUserDto: Login DTO for user authentication
 *
 * This class defines the structure of the DTO (Data Transfer Object) used for user login.
 * It specifies the expected properties and validation rules for user credentials.
 */
export class LoginUserDto {
  /**
   * Username (converted to lowercase)
   *
   * This property represents the username for login. It is decorated with:
   *   - `@IsString()`: Ensures the value is a string.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   *   - `@Transform(({ value }) => value.toLowerCase())`: Transforms the username to lowercase before validation.
   *   - `@ApiProperty()`: Exposes the property in the Swagger API documentation.
   */
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty()
  userName: string

  /**
   * Password
   *
   * This property represents the user's password for login. It is decorated with:
   *   - `@IsString()`: Ensures the value is a string.
   *   - `@ApiProperty()`: Exposes the property in the Swagger API documentation (consider hiding password in actual production).
   */
  @IsString()
  @ApiProperty()
  password: string
}
