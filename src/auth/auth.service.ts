import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role } from 'src/shared/utils'
import { UserWithoutPasswordDto } from 'src/user/dto/create-user.dto'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload: {
      sub: string
      userName: string
    } = { sub: user.userId, userName: user.userName }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async validateUser(
    userName: string,
    password: string,
  ): Promise<UserWithoutPasswordDto> {
    const existingUser: User = await this.userService.findOneByName(userName)
    if (
      existingUser &&
      'password' in existingUser &&
      existingUser.password === password //   !!!!!!!!!!!!  проконтролировать правильность этой логики  !!!!
    ) {
      const { password, ...result } = existingUser
      return result
    }
    return null
  }
}
