import { HttpException, InternalServerErrorException } from '@nestjs/common'
import { DataSource, ObjectLiteral, Repository } from 'typeorm'
import { EntityClass, Role, entityClasses, errorMap, listOfRelations } from './utils'
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

// /**
//  * Функция для получения репозитория для связанной сущности.
//  * 
//  * @param dataSource Экземпляр DataSource от TypeORM.
//  * @param relation Имя связанной сущности.
//  * @returns Репозиторий для связанной сущности.
//  * @throws Ошибка, если связанная сущность недопустима.
//  */
// export function getRelatedRepository(
//   relation: string,
//   //): Repository<ObjectLiteral> {
// ): EntityClass {
//   try {
//     if (!isValidRelation(relation)) {
//       throw new Error(`Invalid relation: ${relation}`) // Связанная сущность недопустима.
//     }

//     if (relation === 'homeworld' || relation === 'planets') {
//       //      return dataSource.getRepository(entityClasses['planets'])
//       return entityClasses['planets']
//     } else if (
//       relation === 'characters' ||
//       relation === 'pilots' ||
//       relation === 'residents' ||
//       relation === 'people'
//     ) {
//       //      return dataSource.getRepository(entityClasses['people'])
//       return entityClasses['people']
//     } else {
//       //      return dataSource.getRepository(entityClasses[relation])
//       return entityClasses[relation]
//     }
//   } catch (error) {
//     // Не удалось получить репозиторий для связанной сущности/
//     throw new Error(`Failed to get repository for relation: ${relation}`)
//   }
// }

// /**
//  * Функция для проверки допустимости связанной сущности.
//  * @param relation Имя связанной сущности.
//  * @returns 'true', если связанная сущность допустима, в противном случае 'false'.
//  */
// function isValidRelation(relation: string): boolean {
//   return listOfRelations.includes(relation)
// }

/**
 * Функция для хеширования пароля пользователя.
 * 
 * @param enteredPassword {string} Пароль, введенный пользователем.
 * @returns {Promise<string>} Хешированную версию пароля.
 */
export async function hashPassword(enteredPassword: string): Promise<string> {
  // Генерация случайной соли
  const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));

  // Хеширование пароля пользователя
  return bcrypt.hashSync(enteredPassword, salt);
}

/**
 * Функция для проверки, является ли текущий пользователь администратором.
 * 
 * @param user {User} Объект пользователя.
 * @returns {Promise<boolean>} 'true' - если пользователь является администратором, 'false' - обычным пользователем.
 */
export async function isCurrentUserAdmin(user: User): Promise<boolean> {
  // Сравнение роли пользователя с ролью администратора
  return user.role === Role.Admin;
}
