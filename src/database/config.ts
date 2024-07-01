import { DataSource, DataSourceOptions } from 'typeorm'
import getConfig from '../configurrations/dotenv.config'

export const config = getConfig()
export const { dbHost, dbPort, dbUser, dbPass, dbName, saltRounds } = config

if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
  throw new Error(
    'В файле конфигурации определены не все параметры для подключения к базе данных!',
  )
}

/**
 * Опции конфигурации для подключения к базе данных
 *
 * Определяет параметры для создания объекта `DataSource` библиотеки TypeORM,
 * используемого для взаимодействия с базой данных MySQL.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: dbHost,
  port: Number(dbPort),
  username: dbUser,
  password: dbPass,
  database: dbName,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  //logging: true,
}

export const dataSource = new DataSource(dataSourceOptions)

//  npx typeorm migration:generate -d ./dist/src/database/config.js ./src/database/migrations/LastMigration  - генерация миграции TypeORM
// npx typeorm migration:create ./src/database/migrations/LastMigration   - генерация пустого файла миграции
