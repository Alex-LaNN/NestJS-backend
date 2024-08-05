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
 * It utilizes various services and functionalities for authentication:
 *
 * - UserModule: Provides access to user data and functionalities for user management.
 * - AuthService: Handles user login, registration, and token management.
 * - PassportModule: Enables Passport.js integration for implementing authentication strategies.
 * - LocalStrategy: Defines the local authentication strategy using username and password.
 * - JwtStrategy: Defines the JWT authentication strategy for verifying access tokens.
 * - JwtModule: Configures the JWT module with the secret key and signing options for token generation.
 * - AuthController: Exposes endpoints for user login, registration, and logout functionalities.
 */
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
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
