import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

/**
 * JwtAuthGuard: Custom JWT Authentication Guard
 *
 * This guard extends the `AuthGuard('jwt')` from `@nestjs/passport` to provide conditional
 * JWT authentication based on the `@Public()` decorator. It intercepts incoming requests
 * and determines if JWT authentication is required.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    // Check for the `@Public()` decorator on the handler or class
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    // If the route is public, bypass JWT authentication
    if (isPublic) {
      return true
    }
    // Otherwise, perform default JWT authentication
    return super.canActivate(context)
  }
}
