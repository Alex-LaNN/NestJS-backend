import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { UserRoles } from 'src/shared/utils'
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm'

/**
 * User Entity
 *
 * This class represents a User entity in the database. It defines the user's
 * properties and uses various decorators to manage database mappings, data
 * validation, and API documentation exposure.
 */
@Entity({ name: 'users' })
@Unique(['userName', 'email'])
export class User {
  /**
   * id property
   *
   * This property represents the unique identifier of the User entity. It is a primary
   * key and is automatically generated using UUIDs. The property is mapped to a
   * database column using the `@PrimaryGeneratedColumn` decorator, specifying the
   * generation strategy as 'uuid'.
   */
  @PrimaryGeneratedColumn('uuid')
  id: number

  /**
   * Username property
   *
   * This property represents the user's username. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the username must be at least 2 characters long.
   */
  @Column()
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  userName: string

  /**
   * Password property
   *
   * This property represents the user's password. It is mapped to a database column
   * and decorated with `ApiProperty` for Swagger documentation, specifying a description
   * and indicating that the password must be at least 5 characters long.
   */
  @Column()
  @ApiProperty({ description: 'User password (at least 5 characters).' })
  password: string

  /**
   * Email property
   *
   * This property represents the user's email address. It is mapped to a database column
   * with a maximum length of 50 characters, decorated with `Expose` to include it in the
   * response during serialization, indexed for faster searching, validated with `IsEmail`
   * to ensure a valid email format, and decorated with `ApiProperty` for Swagger documentation.
   */
  @Expose()
  @Index()
  @IsEmail()
  @Column({ length: 50 })
  @ApiProperty({ description: 'User email.' })
  email: string

  /**
   * Role property
   *
   * This property represents the user's role (e.g., User, Admin). It is mapped to a
   * database column of type 'enum' with possible values defined by the `UserRoles` enum
   * from `src/shared/utils`. It has a default value of `UserRoles.User`. The property
   * is also decorated with `ApiProperty` for Swagger documentation, specifying a description
   * for the user role.
   */
  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.User,
  })
  @ApiProperty({ description: 'User role.' })
  role: UserRoles
}
