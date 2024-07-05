import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserWithoutPasswordDto } from 'src/user/dto/create-user.dto'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: `userName` })
  }

  async validate(
    userName: string,
    password: string,
  ): Promise<UserWithoutPasswordDto> {
    const user: UserWithoutPasswordDto = await this.authService.validateUser(
      userName,
      password,
    )
    console.log(`los:21 - user`, user)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
