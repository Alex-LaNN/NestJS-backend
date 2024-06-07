import { DataSource, DataSourceOptions, MigrationInterface } from 'typeorm'
import getConfig from '../configurrations/dotenv.config'
import { DbConfig } from 'src/shared/utils'

export const config: DbConfig = getConfig()
export const { dbHost, dbPort, dbUser, dbPass, dbName } = config

if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
  throw new Error(
    'В файле конфигурации определены не все параметры для подключения к базе данных!',
  )
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: dbHost,
  port: Number(dbPort),
  username: dbUser,
  password: dbPass,
  database: dbName,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true, // Применение миграций при старте приложения
  migrations: ['dist/**/migrations/*{.ts,.js}'],
}

export const dataSource = new DataSource(dataSourceOptions)

async function runMigrations() {
  await dataSource.initialize()
  await dataSource.runMigrations()
}

runMigrations().catch((error) => {
  console.error('Ошибка при выполнении миграций: ', error)
  process.exit(1)
})

// npx typeorm migration:generate -d ./dist/src/database/config.js ./src/database/migrations/LastMigration
