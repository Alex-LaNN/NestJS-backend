import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";
import { LoginRequestDto } from "src/auth/dto/login-request.dto";
import { UserRoles } from "src/shared/utils";

export class UserResponseDto extends LoginRequestDto {
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