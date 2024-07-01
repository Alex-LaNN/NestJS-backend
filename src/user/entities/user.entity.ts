import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { UserRoles } from 'src/shared/utils'
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity({ name: 'users' })
@Unique(['userName', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  userName: string

  @Column()
  @ApiProperty({ description: 'User password (at least 5 characters).' })
  password: string

  @Expose()
  @Index()
  @IsEmail()
  @Column({ length: 50 })
  @ApiProperty({ description: 'User email.' })
  email: string

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.User,
  })
  @ApiProperty({ description: 'User role.' })
  role: UserRoles
}
