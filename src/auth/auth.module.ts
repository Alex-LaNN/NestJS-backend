import 'dotenv/config'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { UserService } from 'src/user/user.service'

/**
 * AuthModule: Provides authentication functionalities for the application
 *
 * This module imports and configures necessary services and controllers related to user authentication.
 * It utilizes:
 * - UserModule: For accessing user data and functionalities
 * - AuthService: For handling user login, registration, and token management
 * - PassportModule: For enabling Passport.js integration for authentication strategies
 * - LocalStrategy: Defines the local authentication strategy using username and password
 * - JwtStrategy: Defines the JWT authentication strategy for verifying access tokens
 * - JwtModule: Configures JWT module with secret key and signing options
 * - AuthController: Exposes endpoints for user login, registration, and logout
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '99999999999921600s' }, // 6 hours...
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
