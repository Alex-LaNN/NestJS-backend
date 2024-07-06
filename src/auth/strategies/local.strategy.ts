import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { User } from 'src/user/entities/user.entity'

/**
 * Local authentication strategy using PassportStrategy
 *
 * This strategy handles user authentication using username and password credentials.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: `userName` }) // Configure the username field (since our field is different from the default value "username")
  }

  /**
   * Validate user credentials
   *
   * This method is called by Passport when a user attempts to authenticate
   * using the local strategy. It takes the username and password from the request
   * and attempts to validate them against the user database using the AuthService.
   *
   * @param username The username provided by the user
   * @param password The password provided by the user
   * @returns A Promise resolving to a UserWithoutPasswordDto if valid, otherwise throws an UnauthorizedException
   */
  async validate(
    userName: string,
    password: string,
  ): Promise<User> {
    // Attempt to validate the user using the AuthService
    const user: User = await this.authService.validateUser(userName, password)
    // If user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException(
        `lostr:41 - User ${userName} was not validated!...`,
      )
    }
    return user
  }
}
