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
    if (!entityRepository) throw new Error(`Repository not received!!!`)
    try {
      console.log(
        `sd:84 - Start filling the database with an entity ${entityName}...`,
      )
      // Формирование URL-адреса для запроса к SWAPI.
      let next: string | null = `${swapiUrl}${entityName}/`
      // Переменная для хранения результатов текущей страницы.
      let results: T[] = []
      do {
        // Запрос к SWAPI для получения данных.
        const response: Response = await fetch(next)
        if (!response.ok) {
          throw new Error(
            `sd:95 - Failed to fetch data for '${entityName}', received: '${response.statusText}'`,
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
        console.log(`sd:113 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
      } while (next)
      console.log(
        `sd:116 - Entity '${entityName}' has been added to the database...`,
      )
    } catch (error) {
      console.error(
        `sd:120 - Error when filling database with entity '${entityName}': "${error.message}"!!!`,
      )
      throw getResponceOfException(error)
    }
  }

  /**
   * Сохраняет полученный массив данных объектов в базу данных.
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
        `sd:141 - Invalid arguments: 'results' or 'entityRepository' are null or undefined.`,
      )
    }
    // Параллельная обработка всех объектов перед их сохранением
    const modifiedObjects: T[] = await Promise.all(
      results.map(async (object) => {
        object.url = await replaceUrl(object.url)
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
      `sd:164 - modifiedObjects[0]: ${JSON.stringify(modifiedObjects[0], null, 2)}`,
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
        const updatedRelationData: string | string[] =
          await this.changeUrlsObject(
            object,
            object[relationName],
            relationName,
          )
        // Преобразование значения в нужный тип для использования в 'setObjectField'
        const typedUpdatedRelationData =
          updatedRelationData as T[typeof relationName]
        // Установка обновленного значения свойства
        setObjectField(object, relationName, typedUpdatedRelationData)
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
            `sd:250 - Ошибка при заполнении связанных данных объекта ${object.url}: ${error.message}`,
          )
        }
      }
    }
  }

  /**
   * Заменяет все поля с 'Url-адресами' объекта локальными.
   *
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
        `sd:284 - Error replacing URL for '${relationName}': ${error.message}. URL missing!`,
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
      throw new Error(`sd:304 - No metadata found for '${entityName}'`)
    }
    return entityRepository
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
        `sd:323 - Failed to fetch data for ${entityName}: ${response.statusText}`,
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
}
