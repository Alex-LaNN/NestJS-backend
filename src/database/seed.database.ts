import {
  ApiResponse,
  BaseEntity,
  ExtendedBaseEntity,
  SingleEntityResponse,
  SwapiResponse,
  entityClasses,
  entityClassesForFill,
  relatedEntitiesMap,
  swapiUrl,
} from 'src/shared/utils'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import fetch from 'cross-fetch'
import {
  extractIdFromUrl,
  findNameAndDataOfRelationEntity,
  getNameFromId,
  getResponceOfException,
  replaceUrl,
  setObjectField,
} from 'src/shared/common.functions'
import { InjectDataSource } from '@nestjs/typeorm'
import { runMigrations } from './migrate'
import { dbName } from './config'

/**
 * Класс заполнения локальной БД из удаленного источника данных
 */
export class SeedDatabase {
  private queryRunner: QueryRunner
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner()
  }

  /**
   * Функция синхронизации базы данных
   * - Подключается к источнику данных
   * - Создает объект 'queryRunner' для выполнения запросов
   * - Выполняет операции по заполнению базы данных
   */
  synchronizeDatabase = async () => {
    this.queryRunner = this.dataSource.createQueryRunner()
    // Выполнение миграций БД.
    await runMigrations(this.queryRunner)
    try {
      await this.queryRunner.startTransaction()
      console.log(`Start seeding...`)
      // Заполнение БД
      for (const entityName of Object.keys(entityClassesForFill)) {
        await this.addData(entityName)
      }
      // Подтверждение транзакции
      await this.queryRunner.commitTransaction()
      console.log('Finish seeding ok!...')
    } catch (error) {
      // Откат транзакции в случае ошибки
      await this.queryRunner.rollbackTransaction()
      console.error('sd:58 - Error during database synchronization: ', error)
      throw getResponceOfException(error)
    } finally {
      // Освобождение ресурсов 'queryRunner' и 'dataSource'
      await this.queryRunner.release()
      await this.dataSource.destroy()
      console.log(
        `sd:65 - After filling with data, the connection to the database is closed...`,
      )
    }
  }

  /**
   * Получение всех данных с удаленного сервера для определенной сущности и добавление их в БД.
   *
   * @param entityName Имя сущности.
   */
  private async addData<T extends BaseEntity>(
    entityName: string,
  ): Promise<void> {
    // Получение репозитория TypeORM для данной сущности.
    const entityRepository: Repository<T> =
      await this.getRepository<T>(entityName)
    if (!entityRepository) throw new Error(`Репозиторий не получен!!!`)
    try {
      console.log(`sd:83 - Старт заполнения БД сущностью ${entityName}...`)
      // Формирование URL-адреса для запроса к SWAPI.
      let next: string | null = `${swapiUrl}${entityName}/`
      // Переменная для хранения результатов текущей страницы.
      let results: T[] = []
      do {
        // Запрос к SWAPI для получения данных.
        const response: Response = await fetch(next)
        if (!response.ok) {
          throw new Error(
            `sd:93 - Failed to fetch data for '${entityName}', received: '${response.statusText}'`,
          )
        }
        const apiResponse: ApiResponse<T> = await response.json()
        // Проверка типа ответа и обработка данных.
        if ('results' in apiResponse) {
          results = apiResponse.results
          next = apiResponse.next
        } else {
          results = [apiResponse.data]
          next = null
        }
        // Сохранение полученного массива объектов из ответа сервера в БД.
        await this.saveDataToDB<T>(results, entityName, entityRepository)
        // Заполнение связанных данных для сущностей 'people' и 'films'.
        if (entityName === 'people' || entityName === 'films') {
          await this.fillRelatedData(entityName, results)
        }
        console.log(`sd:111 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
      } while (next)
      console.log(`sd:113 - Сущность '${entityName}' добавлена в БД...`)
    } catch (error) {
      console.error(
        `sd:116 - Ошибка, при заполнения БД сущностью '${entityName}': "${error.message}"!!!`,
      )
      throw getResponceOfException(error)
    }
  }

  /**
   * Сохранение полученного массива данных объектов в базу данных.
   *
   * @param results Массив данных объектов, полученных из ответа сервера.
   * @param entityName Имя сущности, к которой пренадлежит массив объектов.
   * @param entityRepository Репозиторий данной сущности.
   */
  private async saveDataToDB<T extends ExtendedBaseEntity>(
    results: T[],
    entityName: string,
    entityRepository: Repository<T>,
  ): Promise<void> {
    // Проверка на 'null' или 'undefined'
    if (!results || !entityRepository) {
      throw new Error(
        `sd:137 - Недопустимые аргументы: 'results' или 'entityRepository' равны null или undefined.`,
      )
    }
    // Параллельная обработка всех объектов перед их сохранением
    const modifiedObjects: T[] = await Promise.all(
      results.map(async (object) => {
        object.id = (await extractIdFromUrl(object.url)) as number
        if (entityName === 'people' || entityName === 'species') {
          const url = object.homeworld
          const idFromUrl = (await extractIdFromUrl(url)) as number
          object.homeworld = object.homeworldId = idFromUrl
        }
        if (entityName === 'planets') {
          const url = object.residents
          object.residents = object.residentsId = (await extractIdFromUrl(
            url,
          )) as number[]
        }
        return object
      }),
    )
    console.log(
      `sd:159 - modifiedObjects[0]: ${JSON.stringify(modifiedObjects[0], null, 2)}`,
    )
    // Сохранение объектов в базу данных
    await entityRepository.save(modifiedObjects)
  }

  /**
   * Инициализирует отсутствующие связанные сущности, а затем добавляет их к объекту.
   *
   * @param entityName Имя сущности, для которой добавляются связанные сущности.
   * @param objects Массив объектов, для которых добавляются связанные сущности.
   * @returns Обновленный объект с измененными соответствующими полями.
   */
  private async fillRelatedData<T extends ExtendedBaseEntity>(
    entityName: string,
    objects: T[],
  ): Promise<void> {
    // Получение списка связанных сущностей.
    const relatedNames: string[] =
      relatedEntitiesMap[entityName]?.relatedEntities || []
    // Итерация по каждому объекту в массиве.
    for (const object of objects) {
      // Заполнение всех полей связанных данных объекта
      for (const relationName of relatedNames) {
        // Получение оригинальных данных для связанной сущности из объекта
        let relationDataForObject: string | string[] = object[relationName]
        // Данные по связанной сущности отсутствуют => инициализация соответствующего поля
        if (relationName === 'images' || !relationDataForObject) {
          setObjectField(
            object,
            relationName,
            Array.isArray(relationDataForObject) ? ([] as any) : null,
          )
          continue
        }
        // Обработка поля связанных данных объекта
        try {
          // Получение значения Id обрабатываемого объекта.
          const objectIdToInsert: number | number[] = await extractIdFromUrl(
            object.url,
          )
          // Получение имени связанной сущности и её связанных данных
          const { nameOfRelationEntity, relationDataIdToInsert } =
            await findNameAndDataOfRelationEntity(relationDataForObject)
          if (relationName === 'homeworld') {
            const tableNameForInsert: string = await getNameFromId(object.url)
            await this.queryRunner.query(
              `INSERT INTO ${dbName}.${tableNameForInsert} (${relationName}Id) VALUES (?)`,
              [relationDataIdToInsert],
            )
          }
          // Получение названия таблицы для вставки связанных данных.
          const tableNameForInsert: string = `${dbName}.${entityName}_${nameOfRelationEntity}`
          if (tableNameForInsert === `${dbName}.films_people`) {
            continue
          }
          // Проверка, является ли `relationDataIdToInsert` массивом
          if (Array.isArray(relationDataIdToInsert)) {
            for (const id of relationDataIdToInsert) {
              // Вставка каждого элемента массива в базу данных
              await this.queryRunner.query(
                `INSERT INTO ${tableNameForInsert} (${entityName}Id, ${nameOfRelationEntity}Id) VALUES (?, ?)`,
                [objectIdToInsert, id],
              )
            }
          } else {
            // Вставка данных в случае, если `relationDataIdToInsert` не является массивом
            await this.queryRunner.query(
              `INSERT INTO ${tableNameForInsert} (${entityName}Id, ${nameOfRelationEntity}Id) VALUES (?, ?)`,
              [objectIdToInsert, relationDataIdToInsert],
            )
          }
        } catch (error) {
          console.error(
            `sd:233 - Ошибка при заполнении связанных данных объекта ${object.url}: ${error.message}`,
          )
        }
      }
    }
  }

  /**
   *
   * @param urlForRequest
   * @param entityName
   * @returns
   */
  private async getEntityDataFromAPI<T extends BaseEntity>(
    urlForRequest: string,
    entityName: string,
  ): Promise<ApiResponse<T>> {
    let response: Response = await fetch(urlForRequest)
    // Детекция получения неудачного ответа
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data for ${entityName}: ${response.statusText}`,
      )
    }
    /**
     * Данные, полученные из ответа сервера.
     */
    const data = await response.json()

    // Определение типа данных и возврат в соответствующем формате
    if (Array.isArray(data.results)) {
      return data as SwapiResponse<T>
    } else {
      return { data: data as T } as SingleEntityResponse<T>
    }
  }

  /**
   * Заменяет все поля с 'Url-адресами' объекта локальными.
   * @param object Обрабатываемый объект.
   * @param relationData Данные связанной сущности.
   * @param relationName  Название связанной сущности.
   * @returns
   */
  private async changeUrlsObject(
    object: Record<string, any>,
    relationData: string | string[],
    relationName: string,
  ): Promise<string | string[]> {
    try {
      // Замена основного Url-а объекта на локальный
      object.url = await replaceUrl(object.url)
      if (Array.isArray(relationData)) {
        // Обработка массива URL-ов
        relationData = await Promise.all(
          relationData.map(async (url: string) => await replaceUrl(url)),
        )
      } else if (typeof relationData === 'string') {
        // Обработка одного URL-а
        object[relationName] = await extractIdFromUrl(relationData)
      }
    } catch (error) {
      console.error(
        `sd:296 - Ошибка при замене URL-а для '${relationName}': ${error.message}. URL отсутствует!`,
      )
      // В случае ошибки - дефолтные значения.
      object[relationName] = Array.isArray(relationData) ? [] : null
    }
    return relationData
  }

  /**
   *
   * @param entityName
   * @returns
   */
  private async getRepository<T extends BaseEntity>(entityName: string) {
    let entityRepository: Repository<T>
    try {
      entityRepository = this.queryRunner.manager.getRepository<T>(
        entityClasses[entityName],
      )
    } catch (error) {
      throw new Error(`No metadata found for '${entityName}'`)
    }
    return entityRepository
  }
}

// /**
//  * Функция подготовки объекта перед его сохранением
//  *
//  * @param entityName Название сущности, к которой пренадлежит объект
//  * @param object Объект, из которого нужно скопировать данные
//  * @param modifiedObject Новый объект, в который будут записаны скопированные данные
//  * @returns Возвращает модифицированный объект
//  */
// private async fillObjectWithData<T extends BaseEntity>(
//   entityName: string,
//   object: T,
//   modifiedObject: T,
// ): Promise<T> {
//   // Извлечение идентификатора сохраняемого объекта из его URL
//   const objectId: number = await extractIdFromURL(object.url as string)
//   modifiedObject.id = objectId
//   // Генерация URL на основе идентификатора
//   modifiedObject.url = await getUrlFromId(entityName, objectId)
//   // Фильтрация и копирование нужных ключей (свойств объекта)
//   const allowedKeys: (keyof T)[] = Object.keys(object).filter(
//     (key) =>
//       !Array.isArray(object[key]) &&
//       !['homeworld', 'created', 'edited', 'residents'].includes(
//         key as string,
//       ),
//   ) as (keyof T)[]
//   // Запись значений свойств копируемого объекта в 'modifiedObject'
//   allowedKeys.forEach((key) => {
//     modifiedObject[key] = object[key]
//   })
//   // Проверка, был ли модифицирован объект
//   if (Object.keys(modifiedObject).length === 0) {
//     console.log(
//       `sd:245 - Один из объектов ${entityName} не был модифицирован и не был сохранен.`,
//     )
//   }
//   return modifiedObject
// }

// /**
//  *  Получение всех данных с удаленного сервера для определенной сущности и добавление их в БД.
//  *
//  * @param entityName Имя сущности.
//  */
// private async addData<T extends BaseEntity>(
//   entityName: string,
//   withRelations: boolean,
// ): Promise<void> {
//   const stringForConsole = withRelations
//     ? fillRelatedDataString
//     : saveToDbString
//   // Получение репозитория TypeORM для данной сущности.
//   const entityRepository: Repository<T> =
//     await this.getRepository<T>(entityName)
//   if (!entityRepository) throw new Error(`Репозиторий не получен!!!`)
//   try {
//     console.log(`sd:115 - Старт ${stringForConsole} ${entityName}...`)
//     // Формирование URL-адреса для запроса к SWAPI.
//     const urlForRequest: string = `${swapiUrl}${entityName}/`
//     // Запрос к SWAPI (Star Wars API) для получения всех доступных ресурсов типа 'entityName'.
//     const apiResponse: ApiResponse<T> = await this.getEntityDataFromAPI<T>(urlForRequest, entityName)
//     // Проверка типа ответа и обработка данных в зависимости от типа
//     let results: T[] = []
//     let next: string | null = null

//     if ('results' in apiResponse) {
//       // Ответ содержит список сущностей
//       results = apiResponse.results
//       next = apiResponse.next
//     } else {
//       // Ответ содержит одиночную сущность
//       results = [apiResponse.data]
//     }
//     //let { results, next } = data
//     console.log(`sd:131 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
//     // Общее количество объектов превышает одну страницу для отображения
//     if (next) {
//       while (next) {
//         // Сохранение полученного массива объектов из ответа сервера в БД
//         await this.saveEntities<T>(
//           results,
//           entityName,
//           entityRepository,
//           withRelations,
//         )
//         // Получение ответа сервера со следующими данными
//         const nextResponse: Response = await fetch(next)
//         // // Получение ответа сервера со следующими данными
//         // response = await fetch(next)
//         if (!nextResponse.ok) {
//           throw new Error(
//             `sd:146 - Failed to fetch data for '${entityName}', received: '${nextResponse.statusText}'`,
//           )
//         }
//         const nextData: SwapiResponse<T> = await nextResponse.json();

//       // Обновление значений 'results' и 'next' для следующей итерации.
//       results = nextData.results;
//       next = nextData.next;
//         // data = (await response.json()) as SwapiResponse<T>
//         // // Обновление значений 'results' и 'next' для следующей итерации.
//         // ;({ results, next } = data)
//       }
//     } else
//       await this.saveEntities<T>(
//         results,
//         entityName,
//         entityRepository,
//         withRelations,
//       )
//     console.log(`sd:156 - Окончание ${stringForConsole} ${entityName}...`)
//   } catch (err) {
//     console.error(
//       `sd:159 - Ошибка, при ${stringForConsole} '${entityName}': "${err.message}"!!!`,
//     )
//     throw getResponceOfException(err)
//   }
// }
