import {
  BaseEntity,
  EntityClassesToPopulateRelationships,
  SwapiResponse,
  entityClasses,
  entityClassesForFill,
  fillRelatedDataString,
  relatedEntitiesMap,
  saveToDbString,
  swapiUrl,
} from 'src/shared/utils'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import fetch from 'cross-fetch'
import {
  extractIdFromURL,
  getResponceOfException,
  getUrlFromId,
  replaceUrl
} from 'src/shared/common.functions'
import { InjectDataSource } from '@nestjs/typeorm'
import { runMigrations } from './migrate'

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
    const withRelations: boolean = true
    // Выполнение миграций БД.
    await runMigrations(this.queryRunner)
    try {
      await this.queryRunner.startTransaction()
      console.log(`Start seeding...`)
      // Заполнение БД
      for (const entityName of Object.keys(entityClassesForFill)) {
        await this.addData(entityName, !withRelations)
      }
      // Подтверждение транзакции
      await this.queryRunner.commitTransaction()
      console.log('Finish seeding ok!...')
    } catch (error) {
      // Откат транзакции в случае ошибки
      await this.queryRunner.rollbackTransaction()
      console.error('Error during database synchronization: ', error)
      throw getResponceOfException(error)
    } finally {
      // Освобождение ресурсов 'queryRunner' и 'dataSource'
      await this.queryRunner.release()
      await this.dataSource.destroy()
      console.log(
        `After filling with data, the connection to the database is closed...`,
      )
    }
    // Заполнение связанных данных.
    try {
      await this.queryRunner.startTransaction()
      console.log(`Start populating related data...`)
      //await this.addData('people', !withRelations)
      // await this.addData('films', !withRelations)
      for (const entityName of Object.keys(
        EntityClassesToPopulateRelationships,
      )) {
        await this.addData(entityName, withRelations)
      }
      // Подтверждение транзакции
      await this.queryRunner.commitTransaction()
      console.log(
        'Filling in the related data has been successfully completed!...',
      )
    } catch (error) {
      // Откат транзакции в случае ошибки
      await this.queryRunner.rollbackTransaction()
      console.error('Error while filling in related data: ', error)
      throw getResponceOfException(error)
    } finally {
      // Освобождение ресурсов 'queryRunner' и 'dataSource'
      await this.queryRunner.release()
      await this.dataSource.destroy()
    }
  }

  /**
   *  Получение всех данных с удаленного сервера для определенной сущности и добавление их в БД.
   *
   * @param entityName Имя сущности.
   */
  private async addData<T extends BaseEntity>(
    entityName: string,
    withRelations: boolean,
  ): Promise<void> {
    const stringForConsole = withRelations
      ? fillRelatedDataString
      : saveToDbString
    // Получение репозитория TypeORM для данной сущности.
    const entityRepository: Repository<T> =
      await this.getRepository<T>(entityName)
    if (!entityRepository) throw new Error(`Репозиторий не получен!!!`)
    try {
      console.log(`sd:115 - Старт ${stringForConsole} ${entityName}...`)
      // Формирование URL-адреса для запроса к SWAPI.
      const urlForRequest: string = `${swapiUrl}${entityName}/`
      // Запрос к SWAPI (Star Wars API) для получения всех доступных ресурсов типа 'entityName'.
      let response: Response = await fetch(urlForRequest)
      // Детекция получения неудачного ответа
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data for ${entityName}: ${response.statusText}`,
        )
      }
      /**
       * Извлечение массива результатов и 'URL' следующей страницы из полученного ответа сервера для дальнейшей обработки списка объектов сущности.
       */
      let data: SwapiResponse<T> = (await response.json()) as SwapiResponse<T>
      let { results, next } = data
      console.log(`sd:131 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
      // Общее количество объектов превышает одну страницу для отображения
      if (next) {
        while (next) {
          // Сохранение полученного массива объектов из ответа сервера в БД
          await this.saveEntities<T>(
            results,
            entityName,
            entityRepository,
            withRelations,
          )
          // Получение ответа сервера со следующими данными
          response = await fetch(next)
          if (!response.ok) {
            throw new Error(
              `sd:146 - Failed to fetch data for '${entityName}', received: '${response.statusText}'`,
            )
          }
          data = (await response.json()) as SwapiResponse<T>
          // Обновление значений 'results' и 'next' для следующей итерации.
          ;({ results, next } = data)
        }
      } else
        await this.saveEntities<T>(
          results,
          entityName,
          entityRepository,
          withRelations,
        )
      console.log(
        `sd:161 - Окончание ${stringForConsole} ${entityName}...`,
      )
    } catch (err) {
      console.error(
        `sd:165 - Ошибка, при ${stringForConsole} '${entityName}': "${err.message}"!!!`,
      )
      throw getResponceOfException(err)
    }
  }

  /**
   * Сохранение массива данных объектов в базу данных с возможностью их предварительной обработки.
   *
   * @param results Массив данных объектов, полученных из ответа сервера.
   * @param entityName Имя сущности, к которой пренадлежит массив объектов.
   * @param entityRepository Репозиторий данной сущности.
   */
  private async saveEntities<T extends BaseEntity>(
    results: T[],
    entityName: string,
    entityRepository: Repository<T>,
    withRelations: boolean,
  ): Promise<void> {
    // Проверка на null или undefined
    if (!results || !entityRepository) {
      throw new Error(
        `sd:187 - Недопустимые аргументы: 'results' или 'entityRepository' равны null или undefined.`,
      )
    }
    // Создание нового объекта для записи и сохранения полученных данных
    let modifiedObject: T
    // Параллельная обработка всех объектов с выбором типа обработки
    const modifiedObjects: T[] = await Promise.all(
      results.map(async (object) => {
        if (withRelations) {
          modifiedObject = (await this.saveObjectWithRelations(
            entityName,
            object,
          )) as T
        } else {
          modifiedObject = (await this.saveObject(
            entityName,
            object,
            entityRepository.create(),
          )) as T
        }
        return modifiedObject
      }),
    )
    console.log(
      `sd:211 - modifiedObjects[0]: ${JSON.stringify(modifiedObjects[0], null, 2)}`,
    )
    // Сохранение объектов в базу данных
    await entityRepository.save(modifiedObjects)
  }

  /**
   * Функция подготовки объекта перед его сохранением
   *
   * @param entityName Название сущности, к которой пренадлежит объект
   * @param object Объект, из которого нужно скопировать данные
   * @param modifiedObject Новый объект, в который будут записаны скопированные данные
   * @returns Возвращает модифицированный объект
   */
  private async saveObject<T extends BaseEntity>(
    entityName: string,
    object: T,
    modifiedObject: T,
  ): Promise<T> {
    // Извлечение идентификатора сохраняемого объекта из его URL
    const objectId: number = await extractIdFromURL(object.url as string)
    modifiedObject.id = objectId
    // Генерация URL на основе идентификатора
    modifiedObject.url = await getUrlFromId(entityName, objectId)
    // Фильтрация и копирование нужных ключей (свойств объекта)
    const allowedKeys: (keyof T)[] = Object.keys(object).filter(
      (key) =>
        !Array.isArray(object[key]) &&
        !['homeworld', 'created', 'edited', 'residents'].includes(
          key as string,
        ),
    ) as (keyof T)[]
    // Запись значений свойств копируемого объекта в 'modifiedObject'
    allowedKeys.forEach((key) => {
      modifiedObject[key] = object[key]
    })
    // // Проверка и обработка свойства 'homeworld'
    // if (object.homeworld && typeof object.homeworld === 'string') {
    //   const id: number = await extractIdFromURL(object.homeworld)
    //   modifiedObject.homeworld = id
    // }
    // // Проверка и обработка свойства 'residents'
    // if (object.residents && Array.isArray(object.residents)) {
    //   const residentIds: number[] = await Promise.all(
    //     (object.residents as string[]).map(async (residentUrl: string) => {
    //       return await extractIdFromURL(residentUrl)
    //     }),
    //   )
    //   modifiedObject.residents = residentIds
    // }
    // Проверка, был ли модифицирован объект
    if (Object.keys(modifiedObject).length === 0) {
      console.log(
        `sd:264 - Один из объектов ${entityName} не был модифицирован и не был сохранен.`,
      )
    }
    return modifiedObject
  }

  /**
   * Инициализирует отсутствующие связанные сущности, а затем добавляет их к объекту.
   *
   * @param entityName Имя сущности, для которой добавляются связанные сущности.
   * @param object Объект данных сущности, к которому добавляются связанные сущности.
   * @returns Обновленный объект с измененными соответствующими полями.
   */
  private async saveObjectWithRelations(
    entityName: string,
    object: Record<string, any>,
  ): Promise<Record<string, any>> {
    // Получение списка связанных сущностей из 'relatedEntitiesMap' для определенной сущности.
    const relatedNames: string[] =
      relatedEntitiesMap[entityName]?.relatedEntities || []
    // Заполнение связанных сущностей
    for (const relationName of relatedNames) {
      // Получение данных для связанной сущности
      let relationData: string | string[] = object[relationName]
      // Данные по связанной сущности отсутствуют => инициализация соответствующего поля
      if (!relationData) {
        object[relationName] =
          Array.isArray(relationData) || relationName === 'images' ? [] : null
        // console.log(
        //   `sd:262 - No related data found for '${relationEntity}' in '${entityName}'. Installed by default...`,
        // )
        continue
      }
      // Изменение всех полей с 'Url-адресами' данного объекта на локальные
      relationData = await changeUrlsObject(object, relationData, relationName)

    }
    return object

    /**
     * Заменяет все поля с 'Url-адресами' объекта локальными.
     * @param object Обрабатываемый объект.
     * @param relationData Данные связанной сущности.
     * @param relationName  Название связанной сущности.
     * @returns
     */
    async function changeUrlsObject(
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
          object[relationName] = await extractIdFromURL(relationData)
        }
      } catch (error) {
        console.error(
          `sd:328 - Ошибка при замене URL-а для '${relationName}': ${error.message}. URL отсутствует!`,
        )
        // В случае ошибки - дефолтные значения.
        object[relationName] = Array.isArray(relationData) ? [] : null
      }
      return relationData
    }
  }

  /**
   *
   * @param entityName
   * @returns
   */
  private async getRepository<T extends BaseEntity>(
    entityName: string,
  ) {
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
