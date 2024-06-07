import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/shared/utils";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ unique: true })
  @ApiProperty({ description: 'Username (at least 2 characters).' })
  userName: string

  @Column()
  @ApiProperty({ description: 'User password (at least 5 characters).' })
  password: string

  @Column({ unique: true })
  @ApiProperty({ description: 'User email.' })
  email: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  @ApiProperty({ description: 'User role.' })
  role: Role
}
