import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRoles } from 'src/shared/constants'

/**
 * AdminGuard: Ensures user is an admin for protected routes
 *
 * This guard implements the `CanActivate` interface and is used to restrict access to specific
 * routes or controllers to only authenticated users with the "Admin" role. It utilizes the
 * `JwtService` to verify the access token from the request and checks the user's role within the
 * payload.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * canActivate: Verifies user role for admin access
   *
   * This method implements the `canActivate` method of the `CanActivate` interface. It
   * checks if the user is authorized to access the protected route based on the following steps:
   *
   * 1. Extracts the authorization header from the incoming HTTP request.
   * 2. Throws an `UnauthorizedException` if the authorization header is missing.
   * 3. Extracts the token from the authorization header (assuming Bearer token format).
   * 4. Throws an `UnauthorizedException` if the token is missing.
   * 5. Attempts to verify the token using the `JwtService`.
   * 6. Throws an `UnauthorizedException` if the token verification fails.
   * 7. Checks if the user's role in the payload is "Admin" using `UserRoles` enum.
   * 8. Returns `true` if the user is an admin, otherwise throws an `UnauthorizedException`.
   *
   * @param context The ExecutionContext object containing request information
   * @returns A Promise resolving to `true` if the user is authorized, otherwise throws an exception
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing authorization header')
    }

    const token = authorizationHeader.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('Missing token')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)
      if (payload.role && payload.role === UserRoles.Admin) {
        return true
      } else {
        throw new UnauthorizedException('User is not an administrator')
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
