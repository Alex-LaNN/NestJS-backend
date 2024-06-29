import { QueryRunner } from 'typeorm'
import { dataSource } from './config'

/**
 * Функция запуска миграций базы данных
 * - Принимает объект `queryRunner` для управления транзакциями
 * - Подключается к источнику данных (если не было подключено ранее)
 * - Выполняет миграции
 * - Завершает транзакцию
 * - Обрабатывает ошибки
 * - Закрывает соединение с БД (если было подключено)
 *
 * @param queryRunner Объект 'QueryRunner' для управления транзакциями
 */
export async function runMigrations(queryRunner: QueryRunner) {
  try {
    // Начало транзакции
    await queryRunner.startTransaction()
    // Проверка подключения к БД
    if (!dataSource.isInitialized) {
      await dataSource.initialize()
      console.log(`Соединение с БД для выполнения миграций установлено...`)
    } else {
      console.log(
        `Соединение с БД для выполнения миграций уже было установлено ранее!`,
      )
    }
    // Выполнение миграций
    await dataSource.runMigrations()
    console.log(`Миграции успешно выполнены...`)
    // Подтверждение транзакции
    await queryRunner.commitTransaction()
  } catch (error) {
    console.error(`Ошибка при выполнении миграций: `, error)
    // Откат транзакции
    await queryRunner.rollbackTransaction()
    throw error
  } finally {
    // Закрытие соединения с БД (если было подключено)
    if (dataSource.isInitialized) {
      await dataSource.destroy()
      console.log(`После выполнения миграций соединение с БД закрыто...`)
    }
  }
}
