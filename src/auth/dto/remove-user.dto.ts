import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class RemoveUserDto {
  @ApiProperty({ description: 'User name', minLength: 2 })
  @IsNotEmpty()
  userName: string
}
