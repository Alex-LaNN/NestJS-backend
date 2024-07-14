import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

/**
 * UserModule
 *
 * This module provides functionalities related to user management. It imports the
 * `UserService` which handles business logic for users, and also includes guards
 * for role-based access control and JWT authentication:
 * 
 * - `RolesGuard`: Ensures that only users with appropriate roles can access certain endpoints.
 * - `JwtAuthGuard`: Ensures that only authenticated users can access certain endpoints.
 *
 * Additionally, it imports the `TypeOrmModule` to establish a database connection
 * for the `User` entity:
 * 
 * - `User`: Represents the user entity in the database.
 *
 * This module exports both `TypeOrmModule` and `UserService`:
 * - `TypeOrmModule`: This makes the database connection accessible to other modules
 *   that might need to interact with users.
 * - `UserService`: This allows other modules to inject the `UserService`
 *   for functionalities like user retrieval or manipulation.
 *
 * Providers in this module handle user-related business logic and access control.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, RolesGuard, JwtAuthGuard],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
