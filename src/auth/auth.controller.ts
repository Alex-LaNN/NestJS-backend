import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginRequestDto } from './dto/login-request.dto'
import { RegistrationRequestDto } from './dto/registration-request.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: LoginRequestDto) {
    return await this.authService.signIn(user)
  }

  @Post('register')
  async register(@Body() user: RegistrationRequestDto) {
    return this.authService.signUp(user)
  }
}
