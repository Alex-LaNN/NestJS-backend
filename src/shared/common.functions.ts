import { HttpException, InternalServerErrorException } from '@nestjs/common'
import { DataSource, ObjectLiteral, Repository } from 'typeorm'
import {
  EntityClass,
  Role,
  entityClasses,
  errorMap,
  listOfRelations,
  localUrl,
  swapiUrl,
} from './utils'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'

/**
 * Функция, определяющая тип ошибки и возвращающая объект ошибки с корректным сообщением.
 *
 * @param error Перехваченная ошибка.
 * @returns Объект ошибки.
 */
export function getResponceOfException(error: any): Error {
  // Проверка на HttpException
  if (error instanceof HttpException) {
    return new HttpException(
      {
        message: error.message,
        errors: error.name,
      },
      error.getStatus(),
    )
  }
  // Обработка ошибок по коду состояния
  if (error.status in errorMap) {
    return errorMap[error.status]
  }
  // Обработка остальных ошибок
  return new InternalServerErrorException('Internal server error')
}

/**
 * Функция для получения расширения файла из его имени.
 *
 * @param fileName Имя файла.
 * @returns Расширение файла.
 */
export function getFileExtension(fileName: string): string {
  const fileParts: string[] = fileName.split('.')
  return fileParts[fileParts.length - 1]
}

/**
 * Функция для хеширования пароля пользователя.
 *
 * @param enteredPassword {string} Пароль, введенный пользователем.
 * @returns {Promise<string>} Хешированную версию пароля.
 */
export async function hashPassword(enteredPassword: string): Promise<string> {
  // Генерация случайной соли
  const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))

  // Хеширование пароля пользователя
  return bcrypt.hashSync(enteredPassword, salt)
}

/**
 * Функция для проверки, является ли текущий пользователь администратором.
 *
 * @param user {User} Объект пользователя.
 * @returns {Promise<boolean>} 'true' - если пользователь является администратором, 'false' - обычным пользователем.
 */
export async function isCurrentUserAdmin(user: User): Promise<boolean> {
  // Сравнение роли пользователя с ролью администратора
  return user.role === Role.Admin
}

/**
 *
 * @param url
 * @returns
 */
export async function extractIdFromURL(url: string): Promise<number> {
  if (url === null || url === undefined) return 0
  const regex = /\/(\d+)\/?$/
  const match = url.match(regex)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  } else {
    throw new Error(`Число не найдено. Не корректный Url: ${url}`)
  }
}

/**
 *
 * @param entityName
 * @param objectId
 * @returns
 */
export async function getUrlFromId(
  entityName: string,
  objectId: number,
): Promise<string> {
  return `${localUrl}${entityName}/${objectId}/`
}

// Замена URL-адресов связанных данных у конкретной сущности на локальные URL-адреса.
export async function replaceUrl(url: string): Promise<string> {
  return url.replace(swapiUrl, localUrl)
}
