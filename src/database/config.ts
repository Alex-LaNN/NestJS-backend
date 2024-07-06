import { DataSource, DataSourceOptions } from 'typeorm'
import getConfig from '../configurrations/dotenv.config'

// Load environment variables from .env file
export const config = getConfig()
// Extract database connection details from config
export const { dbHost, dbPort, dbUser, dbPass, dbName, saltRounds } = config
// Validate required database connection parameters
if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
  throw new Error(
    'В файле конфигурации определены не все параметры для подключения к базе данных!',
  )
}

/**
 * Configuration options for database connection
 *
 * Defines parameters for creating a `DataSource` object from the TypeORM library,
 * used to interact with the MySQL database.
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

// Create a TypeORM DataSource instance
export const dataSource = new DataSource(dataSourceOptions)

// Initialize the data source and handle errors
;(async () => {
  try {
    await dataSource.initialize()
    console.log('config:41 - Data Source has been initialized!')
  } catch (error) {
    console.error('config:43 - Error during Data Source initialization', error)
  }
})()

//  npx typeorm migration:generate -d ./dist/src/database/config.js ./src/database/migrations/LastMigration  - генерация миграции TypeORM
// npx typeorm migration:create ./src/database/migrations/LastMigration   - генерация пустого файла миграции
