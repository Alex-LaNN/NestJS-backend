import { dataSource } from "./config"

/**
 * Функция запуска миграций базы данных
 * - Подключается к источнику данных
 * - Выполняет миграции
 * - Завершает работу с источником данных
 * - Обрабатывает ошибки 
 */
export async function runMigrations(): Promise<void> {
  try {
    // Подключение к источнику данных
    await dataSource.initialize()
    console.log('Соединение с БД для выполнения миграций установлено...')

    // Выполнение миграций
    await dataSource.runMigrations()
    console.log('Миграции успешно выполнены...')
  } catch (error) {
    console.error('Ошибка при выполнении миграций: ', error)
    process.exit(1)
  } finally {
    // Закрытие соединения с БД
    await dataSource.destroy()
    console.log('После выполнения миграций соединение с БД закрыто...')
  }
}

runMigrations().catch((error) => {
  console.error('Ошибка при выполнении миграций: ', error)
  process.exit(1)
})
