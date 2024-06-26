import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { config } from './config'

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { dbHost, dbPort, dbUser, dbPass, dbName } = config

    if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
      throw new Error(
        'В файле конфигурации определены не все параметры для подключения к базе данных!',
      )
    }

    /**
     * Опции для модуля TypeORM
     *
     * Определяет параметры конфигурации для модуля TypeORM,
     * используемого для взаимодействия с базой данных MySQL.
     */
    const options: TypeOrmModuleOptions = {
      type: 'mysql',
      host: dbHost,
      port: Number(dbPort),
      username: dbUser,
      password: dbPass,
      database: dbName,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/src/database/migrations/*{.ts,.js}'],
      synchronize: false,
    }

    return options
  }
}

