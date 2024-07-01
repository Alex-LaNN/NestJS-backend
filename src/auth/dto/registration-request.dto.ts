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

export class RegistrationRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  userName: string

  @IsNotEmpty()
  @Validate(EmailValidationService)
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string

  @IsString()
  @IsNotEmpty()
  @Validate(MatchValidator, ['password'])
  repeatedPasword: string

  @IsEnum(UserRoles)
  @ApiProperty({ enum: UserRoles, default: UserRoles.User })
  role?: UserRoles
}
