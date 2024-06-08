import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { config, dataSourceOptions } from './config'

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {

  createTypeOrmOptions(): TypeOrmModuleOptions {

    const { dbHost, dbPort, dbUser, dbPass, dbName } = config

    if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
      throw new Error(
        'В файле конфигурации определены не все параметры для подключения к базе данных!',
      )
    }

    //    const options: TypeOrmModuleOptions = dataSourceOptions
    
    const options: TypeOrmModuleOptions = {
      type: 'mysql',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPass,
      database: dbName,
      entities: ['dist/**/*.entity{.ts,.js}'],
      //synchronize: true,
    }

    return options
  }
}

