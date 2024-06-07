import { Module } from '@nestjs/common'
import { PeopleModule } from './people/people.module'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { FilmsModule } from './films/films.module'
import { PlanetsModule } from './planets/planets.module'
import { ImagesModule } from './images/images.module'
import { StarshipsModule } from './starships/starships.module'
import { VehiclesModule } from './vehicles/vehicles.module'
import { SpeciesModule } from './species/species.module'
import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: false }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PeopleModule,
    FilmsModule,
    PlanetsModule,
    ImagesModule,
    StarshipsModule,
    VehiclesModule,
    SpeciesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
