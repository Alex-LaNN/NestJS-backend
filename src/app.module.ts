import { Module, OnModuleInit } from '@nestjs/common'
import { PeopleModule } from './people/people.module'
import { AuthModule } from './auth/auth.module'
//import { DatabaseModule } from './database/database.module'
import { FilmsModule } from './films/films.module'
import { PlanetsModule } from './planets/planets.module'
import { ImagesModule } from './images/images.module'
import { StarshipsModule } from './starships/starships.module'
import { VehiclesModule } from './vehicles/vehicles.module'
import { SpeciesModule } from './species/species.module'
import { UserModule } from './user/user.module'
//import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  dataSourceOptions,
  dbHost,
  dbName,
  dbPass,
  dbPort,
  dbUser,
} from './database/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { ConfigModule } from '@nestjs/config'
import { SeedDatabase } from './database/seed.database'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return dataSourceOptions
      },
    }),
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
  //controllers: [AppController],
  providers: [
    SeedDatabase,
    //AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
  export class AppModule {}
// export class AppModule implements OnModuleInit {
//   constructor(private readonly seedDatabase: SeedDatabase) {}
//   async onModuleInit() {
//     try {
//       // Проверка инициализации соединения с БД
//       if (this.seedDatabase.dataSource.isInitialized) {
//         await this.seedDatabase.synchronizeDatabase();
//       } else {
//         throw new Error(
//           `am:67 - No connection to the database was established before synchronization.`,
//         )
//       }
//     } catch (error) {
//       console.error('am:71 - Error during database synchronization:', error);
//     }
//   }
// }
