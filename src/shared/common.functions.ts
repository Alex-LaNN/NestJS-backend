import { HttpException, InternalServerErrorException } from '@nestjs/common'
import {
  ExtendedBaseEntity,
  Role,
  errorMap,
  localUrl,
  relationMappings,
  swapiUrl,
} from './utils'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'

/**
 * Устанавливает значение для объекта.
 */
export function setObjectField<T extends ExtendedBaseEntity, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
) {
  obj[key] = value
}

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
 * Извлечение ID из URL
 *
 * @param url URL для извлечения ID
 * @returns ID, извлеченный из URL
 */
export async function extractIdFromUrl(
  url: any,
): Promise<number | number[] | null> {
  if (Array.isArray(url)) {
    if (!url) return []
    const ids = await Promise.all(
      url.map(async (element: any) => {
        const id = await extractIdFromUrl(element)
        // Проверка, является ли результат числом или массивом чисел
        if (Array.isArray(id)) {
          throw new Error('Nested arrays not supported')
        }
        return id
      }),
    )
    return ids as number[]
  }
  if (!url) return null
  const regex = /\/(\d+)\/?$/
  const match = url.match(regex)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  } else {
    throw new Error(`cf:114 - Number not found. Invalid URL: ${url}`)
  }
}

/**
 * Генерация значения локального URL объекта по его Id
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

/**
 * Замена URL-адресов у объекта на локальные URL-адреса.
 *
 * @param url
 * @returns
 */
export async function replaceUrl(url: string): Promise<string> {
  return url.replace(swapiUrl, localUrl)
}

/**
 * Функция для определения имени связанной сущности по её URL и извлечения её данных.
 *
 * @param url - URL, содержащий имя связанной сущности и его Id.
 * @returns Объект, содержащий основную сущность и найденную группу.
 */
export async function findNameAndDataOfRelationEntity(
  url: string | string[],
): Promise<{
  nameOfRelationEntity: string
  relationDataIdToInsert: number | number[]
}> {
  // Выделение имени связанной сущности.
  const nameOfRelationEntity: string = await getNameFromId(url)
  // Извлечение данных связанной сущности с преобразованием их в нужный формат.
  const relationDataIdToInsert: number | number[] =
    await extractIdFromUrl(url)

  return {
    nameOfRelationEntity,
    relationDataIdToInsert,
  }
}

/**
 * 
 * @param url 
 * @returns 
 */
export async function getNameFromId(url: string | string[]): Promise<string> {
  // Если URL является массивом, берется первое значение.
  const actualUrl: string = Array.isArray(url) ? url[0] : url
  // Разбивка URL на части.
  const urlParts: string[] = actualUrl.split('/').filter(Boolean)
  if (urlParts.length < 5) {
    throw new Error(`cf:125 - Неверный формат URL: ${actualUrl}`)
  }
  // Выделение значения 'name' из 'Url'.
  const name: string = urlParts[3]
  // Возврат выделенного значения.
  return name
} 
