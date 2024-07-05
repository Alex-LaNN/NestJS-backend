import { Injectable } from '@nestjs/common'
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
   *
   * @param user
   * @returns
   */
  async signIn(user: LoginRequestDto): Promise<{ access_token: string }> {
    const verifiedUser: User = await this.validateUser(
      user.userName,
      user.password,
    )
    if (verifiedUser) {
      return this.createToken(verifiedUser)
    }
    throw new Error (`aus:30 - Неверное имя пользователя или пароль!..`)
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
  async signUp(
    user: RegistrationRequestDto,
  ): Promise<{ access_token: string }> {
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
        `aus:76 - Error creating user: ${(JSON.stringify(newUser as ErrorResponce), null, 2)}`,
      )
    }
  }

  /**
   *
   * @param user
   * @returns
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
