import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRoles } from 'src/shared/utils'
import { ROLES_KEY } from '../decorators/roles.decorator'

/**
 * RolesGuard: Guard for Role-Based Authorization
 *
 * This guard implements the `CanActivate` interface and is used to enforce role-based
 * authorization on routes. It checks the required roles defined using the `@Roles()` decorator
 * on the route handler or controller class and compares them to the user's roles retrieved from
 * the request.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from route handler or controller class (if any)
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    // If no roles are required, allow access
    if (!requiredRoles) {
      return true
    }
    // Extract user object from the request
    const { user } = context.switchToHttp().getRequest()
    // Throw an error if user is not found in the request
    if (!user) {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN)
    }
    // Check if user has any of the required roles
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
