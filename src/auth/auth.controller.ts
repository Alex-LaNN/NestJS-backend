import { ApiBody, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginRequestDto } from './dto/login-request.dto'
import { RegistrationRequestDto } from './dto/registration-request.dto'
import { AdminGuard } from './guards/admin.guard'
import { UserRoles } from 'src/shared/utils'
import { UserService } from 'src/user/user.service'

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
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  async login(@Req() req) {
    return await this.authService.signIn(req.user)
  }

  /**
   * Registration endpoint for standard user creation
   *
   * This method handles POST requests to the `/auth/register` endpoint. It expects a
   * `RegistrationRequestDto` object containing user registration details in the request body.
   * It interacts with the `AuthService` to handle user registration and potentially
   * returns a response object upon successful registration.
   *
   * @param registrationData The RegistrationRequestDto object containing user registration details (from request body)
   * @returns A Promise resolving to a response object
   */
  @Post('/register')
  @ApiBody({ type: RegistrationRequestDto })
  async register(@Body() registrationData: RegistrationRequestDto) {
    return this.authService.signUp(registrationData)
  }

  /**
   * Registration endpoint for creating an admin user (requires admin privileges)
   *
   * This method handles POST requests to the `/auth/register-admin` endpoint. It requires the
   * user to be authenticated as an admin via the `AdminGuard`. It expects a
   * `RegistrationRequestDto` object containing user registration details in the request body.
   * It sets the user's role to "Admin" before calling the `AuthService` to create the user.
   *
   * @param registrationData The RegistrationRequestDto object containing user registration details (from request body)
   * @returns A Promise resolving to a response object
   */
  @Post('/register-admin')
  @UseGuards(AdminGuard)
  @ApiBody({ type: RegistrationRequestDto })
  async registerAdmin(@Body() registrationData: RegistrationRequestDto) {
    // Set the user's role to "Admin" before creating the user
    registrationData.role = UserRoles.Admin
    return this.authService.signUp(registrationData)
  }

  /**
   * Logout endpoint for user session termination
   *
   * This method handles POST requests to the `/auth/logout` endpoint. It clears the
   * "jwtToken" cookie from the user's response to invalidate the access token and
   * potentially returns a success message indicating successful logout.
   *
   * @param res The HTTP response object
   * @returns A Promise resolving to a JSON object with a success message
   */
  @Post('/logout')
  async logout(@Response() res) {
    res.clearCookie('jwtToken')
    return res
      .status(200)
      .json({ message: 'Выход из системы выполнен успешно...' })
  }

  /**
   * Endpoint for removing a user (requires admin privileges)
   *
   * This method handles DELETE requests to the `/auth/remove-user` endpoint. It requires the
   * user to be authenticated as an admin via the `AdminGuard`. It expects a request body containing
   * the `userName` property of the user to be removed.
   *
   * - Calls the `UserService` to remove the user with the provided username.
   * - Returns a success message if the user is removed successfully.
   * - Throws a `NotFoundException` if the user with the provided username is not found.
   *
   * @param body An object containing the `userName` property of the user to be removed (from request body)
   * @returns A Promise resolving to an object with a success message on successful deletion,
   *          or throws a `NotFoundException` if the user is not found.
   */
  @Delete('/remove-user')
  @UseGuards(AdminGuard)
  async removeUser(@Body() body: { userName: string }) {
    const result = await this.userService.remove(body.userName)
    if (result) {
      return {
        message: `User "${body.userName}" was removed successfully.`,
      }
    } else {
      throw new NotFoundException(
        `User with username "${body.userName}" not found.`,
      )
    }
  }
}
