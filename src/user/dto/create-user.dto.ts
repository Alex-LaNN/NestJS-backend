import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/shared/utils';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'The username must contain at least 2 characters.' })
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  userName: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'The password must contain at least 5 characters.' })
  @ApiProperty({ description: 'User password (at least 5 characters).' })
  password: string

  @IsEmail({}, { message: 'Incorrect email address.' })
  @ApiProperty({ description: '' })
  email: string

  @IsEnum(Role)
  @ApiProperty({ enum: Role, default: Role.User })
  role: Role
}

export class UserWithoutPasswordDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
