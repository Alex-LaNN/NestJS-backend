import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import {
  Body,
  Controller,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginRequestDto } from './dto/login-request.dto'
import { RegistrationRequestDto } from './dto/registration-request.dto'

/**
 * Authentication controller for user login, registration, and logout functionalities
 *
 * This controller handles HTTP requests related to user authentication, including login,
 * registration, and logout. It utilizes the `AuthService` to perform user authentication
 * and token management.
 */
@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login endpoint for user authentication
   *
   * This method handles POST requests to the `/auth/login` endpoint. It expects a
   * `LoginRequestDto` object containing the user's credentials (username and password)
   * in the request body. It utilizes the `LocalAuthGuard` to authenticate the user
   * and then calls the `AuthService` to sign the user in and generate an access token.
   *
   * @param user The LoginRequestDto object containing username and password (from request body)
   * @returns A Promise resolving to an object with the `access_token` property on successful login,
   *          or throws an error if authentication fails.
   */
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @Post('/login')
  async login(@Req() req) {
    return await this.authService.signIn(req.user)
  }

  @ApiBody({ type: RegistrationRequestDto })
  @Post('/register')
  async register(@Body() registrationData: RegistrationRequestDto) {
    return this.authService.signUp(registrationData)
  }

  @Post('/logout')
  async logout(@Response() res) {
    res.clearCookie('jwtToken')
    return res
      .status(200)
      .json({ message: 'Выход из системы выполнен успешно...' })
  }
}
