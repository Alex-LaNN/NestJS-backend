import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Payload } from 'src/shared/constants'

/**
 * JwtStrategy: JWT Authentication Strategy
 *
 * This class implements the Passport JWT strategy for user authentication using a JSON Web Token (JWT).
 * It defines how the JWT is extracted from the request header, validates its signature using the secret key,
 * and retrieves the user information from the payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Don't ignore expiration (ensure token is not expired)
      ignoreExpiration: false,
      // Use the JWT secret key from the environment variable
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  /**
   * Retrieves the 'user ID' and 'role' from the JWT package and returns them
   * @param payload JWT payload
   * @returns An object with a user ID (userId) and a role (role)
   */
  async validate(payload: Payload) {
    return { userId: payload.sub, role: payload.role }
  }
}
