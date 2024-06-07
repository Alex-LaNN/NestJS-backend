import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { AuthGuard } from 'src/auth/guards/auth.guard'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Регистрация необходимых репозиториев в текущей области
  providers: [UserService, RolesGuard, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
