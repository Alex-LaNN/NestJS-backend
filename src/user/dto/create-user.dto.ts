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

export class CreateUserDto {
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'The username must contain at least 2 characters.' })
  userName: string

  @ApiProperty({ description: 'User password (at least 5 characters).' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'The password must contain at least 5 characters.' })
  password: string

  @ApiProperty({ description: 'User email.' })
  @Validate(EmailValidationService)
  @IsEmail({}, { message: 'Incorrect email address.' })
  email: string

  @ApiProperty({ default: UserRoles.User })
  @IsEnum(UserRoles)
  roles?: string
}

export class UserWithoutPasswordDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
