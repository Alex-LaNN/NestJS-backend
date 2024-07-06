import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, RolesGuard, JwtAuthGuard],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
