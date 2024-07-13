import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

/**
 * RemoveUserDto: Removal DTO for user deletion
 *
 * This class defines the structure of the DTO (Data Transfer Object) used for user removal.
 * It specifies the expected property and validation rule for identifying the user to be deleted.
 */
export class RemoveUserDto {
  /**
   * Username (minimum length of 2 characters)
   *
   * This property represents the username of the user to be removed. It is decorated with:
   *   - `@ApiProperty({ description: 'User name', minLength: 2 })`: Provides a description and minimum length in Swagger API documentation.
   *   - `@IsNotEmpty()`: Ensures the value is not empty.
   */
  @ApiProperty({ description: 'User name', minLength: 2 })
  @IsNotEmpty()
  userName: string
}
