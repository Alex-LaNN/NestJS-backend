import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { LoginRequestDto } from './dto/login-request.dto'
import { ErrorResponce } from 'src/shared/utils'
import { RegistrationRequestDto } from './dto/registration-request.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Handles user sign-in or registration based on the provided data.
   *
   * This method checks the DTO type (`RegistrationRequestDto` or `LoginRequestDto`)
   * to determine if the user is attempting to register or login.
   *
   * @param user User data for registration or login (either RegistrationRequestDto or LoginRequestDto)
   * @returns Promise<{ access_token: string }> Object containing the access token on success
   * @throws BadRequestException Error thrown for invalid credentials, username conflicts, or other bad requests
   */
  async signIn(
    user: RegistrationRequestDto | LoginRequestDto,
  ): Promise<{ access_token: string }> {
    let existingUser: User | null = null
    if ('repeatedPassword' in user) {
      // Registration Logic
      const registrationUser = user as RegistrationRequestDto
      // Check for username uniqueness
      const userExists = await this.userService.findOneByName(
        registrationUser.userName,
      )
      if (userExists) {
        throw new BadRequestException('User with this username already exists')
      }
      // Create new user
      const result = await this.userService.create(registrationUser)
      if (this.isErrorResponse(result)) {
        throw new BadRequestException(result as ErrorResponce)
      }
      existingUser = result
    } else {
      // Login Logic
      const loginUser = user as LoginRequestDto
      existingUser = await this.validateUser(
        loginUser.userName,
        loginUser.password,
      )
      if (!existingUser) {
        throw new BadRequestException('Invalid credentials')
      }
    }

    const payload = {
      sub: existingUser.id,
      userName: existingUser.userName,
      role: existingUser.role,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  /**
   * Validates user credentials for login.
   *
   * This method retrieves the user by username and compares the provided password with the hashed password stored in the database.
   *
   * @param name Username of the user attempting to login
   * @param pass Password provided by the user
   * @returns Promise<User | null> Resolved user object if credentials are valid, otherwise null
   */
  async validateUser(name: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByName(name)
    if (user && 'password' in user) {
      const isMatch = await bcrypt.compare(pass, user.password)
      return isMatch ? user : null
    }
    return null
  }

  /**
   * Handles user registration.
   *
   * This method calls the `userService.create` method to create a new user and handles potential errors.
   * If successful, it calls `signIn` to generate a JWT token for the newly created user.
   *
   * @param user User data for registration (RegistrationRequestDto)
   * @returns Promise<{ access_token: string }> Object containing the access token on success
   * @throws Error Exception thrown for unexpected errors during user creation
   */
  async signUp(
    user: RegistrationRequestDto,
  ): Promise<{ access_token: string }> {
    // Create new user
    const newUser: User | ErrorResponce = await this.userService.create(user)

    // Check if user creation was successful (not an error response)
    if (newUser instanceof User) {
      // Generate token for the newly created user
      return this.signIn(newUser)
    } else {
      // Handle user creation error
      throw new Error(
        `as:110 - Error creating user: ${JSON.stringify(newUser as ErrorResponce), null, 2}`,
      )
    }
  }

  /**
   * Checks if the provided response object is an instance of the `ErrorResponse` class.
   *
   * This helper method is used to distinguish between successful user creation responses (of type `User`)
   * and error responses (of type `ErrorResponse`) returned by the `userService.create` method.
   *
   * @param response The response object to be checked
   * @returns boolean True if the response is an `ErrorResponse`, false otherwise
   */
  private isErrorResponse(
    response: User | ErrorResponce,
  ): response is ErrorResponce {
    return response && 'isActionCompleted' in response
  }
}
