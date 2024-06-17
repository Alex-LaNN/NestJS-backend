import { MigrationExecutor } from 'typeorm/migration/MigrationExecutor'
import { dataSource } from '../config'
import { Migration } from 'typeorm'

/**
 * Откат всех миграций
 */
async function revertAllMigrations() {
  // Создаем подключение к базе данных
  await dataSource.initialize()
  console.log('Database connection established.')

  const migrationExecutor: MigrationExecutor = new MigrationExecutor(dataSource)

  // Получаем список всех миграций
  const migrations: Migration[] = await migrationExecutor.getAllMigrations()

  // Откатываем каждую миграцию по очереди
  for (const migration of migrations.reverse()) {
    console.log(`Reverting migration: ${migration.name}`)
    // Откат конкретной миграции
    await migrationExecutor.undoLastMigration()
  }

  await dataSource.destroy()
  console.log('All migrations have been reverted.')
}

revertAllMigrations().catch(console.error)

// go revert-migrations  - 2 скрипта
