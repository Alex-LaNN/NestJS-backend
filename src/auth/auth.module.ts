import 'dotenv/config'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
//import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { UserService } from 'src/user/user.service'
import { RolesGuard } from './guards/roles.guard'
//import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '21600s' }, // 6 hours...
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    // JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    UserService,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
