import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { UserRoles } from 'src/shared/utils'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

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
      //console.log(`adgu:34 - payload:`, payload) ////////////////////////////
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
