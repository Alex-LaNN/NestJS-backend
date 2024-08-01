import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { ErrorResponce } from 'src/shared/constants'
import { RegistrationUserDto } from './dto/registration-user.dto'

/**
 * Authentication service for handling user login, registration, and token management
 *
 * This service provides methods for authenticating users, generating access tokens,
 * and managing user sessions. It interacts with the `UserService` for user data
 * access and the `JwtService` for generating and handling JSON Web Tokens (JWTs).
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Signs in a user and generates an access token
   *
   * This method takes a `LoginRequestDto` containing the user's credentials (username and password)
   * and attempts to authenticate the user. If successful, it generates an access token for the user.
   *
   * @param user The LoginRequestDto object containing username and password
   * @returns A Promise resolving to an object with the access_token property, or throws an error
   *          if authentication fails.
   */
  async signIn(user: User): Promise<{ access_token: string }> {
    return this.createToken(user)
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
    const user: User = await this.userService.findOneByName(name)
    if (user) {
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
  async signUp(user: RegistrationUserDto): Promise<{ access_token: string }> {
    // Create new user
    const newUser: User | ErrorResponce = await this.userService.create(user)
    // Check if user creation was successful (not an error response)
    if (newUser instanceof User) {
      // Generate token for the newly created user
      return this.createToken(newUser)
      //return this.signIn(newUser)
    } else {
      // Handle user creation error
      throw new Error(
        `auth.ser:76 - Error creating new user: ${JSON.stringify(user)}`,
      )
    }
  }

  /**
   * Creates a JSON Web Token (JWT) containing user information.
   *
   * This method takes a `User` object as input and creates a JWT payload containing the user's ID, username, email, and role.
   * It then uses the `jwtService.signAsync` method to sign the payload and generate a JWT access token.
   *
   * @param user The user object for whom the token is being generated.
   * @returns Promise that resolves to an object with a single property:
   *   - `access_token`: The generated JWT access token as a string.
   */
  async createToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
