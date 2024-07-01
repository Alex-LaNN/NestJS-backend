import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRoles } from 'src/shared/utils'
import { ROLES_KEY } from '../decorator/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    if (!user) {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN)
    }
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
