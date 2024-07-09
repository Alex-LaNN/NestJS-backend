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
import { UserRoles } from 'src/shared/utils'

export class RegistrationUserDto {
  @ApiProperty({ description: 'User name', minLength: 2 })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  userName: string

  @ApiProperty({ description: 'User email' })
  @IsNotEmpty()
  @Validate(EmailValidationService)
  email: string

  @ApiProperty({ description: 'User password', minLength: 4 })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string

  @ApiProperty({ description: 'Repeated password' })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchValidator, ['password'])
  repeatedPasword: string

  @ApiProperty({ enum: UserRoles, default: UserRoles.User })
  @IsEnum(UserRoles)
  role?: UserRoles
}
