import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsUUID } from 'class-validator'
import { LoginUserDto } from 'src/auth/dto/login-user.dto'
import { UserRoles } from 'src/shared/utils'

export class UserResponseDto extends LoginUserDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty()
  @IsString()
  userName: string

  @ApiProperty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  readonly roles: UserRoles[]
}
