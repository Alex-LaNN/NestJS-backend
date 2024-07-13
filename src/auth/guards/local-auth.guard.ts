import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * LocalAuthGuard: Custom Guard for Local Authentication Strategy
 *
 * This guard extends the `AuthGuard('local')` from `@nestjs/passport` to perform
 * additional logic before delegating authentication to the local strategy. It checks
 * for the presence of username and password in the request body and throws an
 * `UnauthorizedException` if missing.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { userName, password } = request.body

    // Check if username and password are present in the request body
    if (!userName || !password) {
      throw new UnauthorizedException('Missing username or password')
    }

    // If username and password are provided, delegate authentication to the local strategy
    return (await super.canActivate(context)) as boolean
  }
}
