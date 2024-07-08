import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { userName, password } = request.body

    if (!userName || !password) {
      throw new UnauthorizedException('Missing username or password')
    }

    return (await super.canActivate(context)) as boolean
  }
}
