import {
  SwapiResponse,
  entityClasses,
  entityClassesToFillFirst,
  entityClassesToFillNext,
  relatedEntitiesMap,
  swapiUrl,
} from 'src/shared/utils'
import {
  DataSource,
  DeepPartial,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm'
import fetch from 'cross-fetch'
import { extractIdFromURL, getResponceOfException, replaceUrl } from 'src/shared/common.functions'
import { InjectDataSource } from '@nestjs/typeorm'

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
    try {
      await this.queryRunner.startTransaction()
      console.log(`Data source initialized. Let's start seeding...`)
      let isNeedToFillRelatedEntities: boolean = true

      //await this.addData('species', isNeedToFillRelatedEntities)

      // Заполнения БД первоочередными сущностями
      for (const entityName of Object.keys(entityClassesToFillFirst)) {
        await this.addData(entityName, isNeedToFillRelatedEntities)
      }
      // Заполнения БД остальными сущностями
      // for (const entityName of Object.keys(entityClassesToFillNext)) {
      //   await this.addData(entityName, isNeedToFillRelatedEntities)
      // }
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
    }
  }

  /**
   *  Заполнение БД.
   *
   * @param entityName Имя сущности.
   * @param isNeedToFillRelatedEntities
   */
  private async addData<T extends Record<string, unknown>>(
    entityName: string,
    isNeedToFillRelatedEntities: boolean,
  ): Promise<void> {
    let entityRepository: Repository<T>
    try {
      // Получение репозитория TypeORM для данной сущности.
      entityRepository = this.queryRunner.manager.getRepository<T>(
        entityClasses[entityName],
      )
      } catch (error) {
      //   console.error(
      //     `sd:85 - Failed to get repository for '${relationName}', message: '${error.message}'`,
      //)
        throw new Error(`No metadata found for '${entityName}'`)
    }
    try {
      // Формирование URL-адреса для запроса к SWAPI.
      const urlForRequest: string = `${swapiUrl}${entityName}/`
      // Запрос к SWAPI (Star Wars API) для получения всех доступных ресурсов типа 'entityName'.
      let response: Response = await fetch(urlForRequest)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data for ${entityName}: ${response.statusText}`,
        )
      }
      // Извлечение массива результатов и 'URL' следующей страницы из полученного ответа сервера.
      let data: SwapiResponse<T> = (await response.json()) as SwapiResponse<T>
      let { results, next } = data
      //console.log(`sd:102 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
      while (next) {
        // Сохранение объектов в БД без связанных сущностей
        if (!isNeedToFillRelatedEntities) {
          await this.prioritySaveEntities<T>(
            results,
            entityName,
            entityRepository,
          )
          // Сохранение объектов в БД с заполнением связанных сущностей
        } else await this.saveEntities<T>(results, entityName, entityRepository)
        // Получение ответа сервера с данными следующей страницы
        response = await fetch(next)
        if (!response.ok) {
          throw new Error(
            `sd:117 - Failed to fetch data for '${entityName}', received: '${response.statusText}'`,
          )
        }
        data = (await response.json()) as SwapiResponse<T>
        // Обновление значений 'results' и 'next' для следующей итерации.
        ;({ results, next } = data)
      }
    } catch (err) {
      console.error(
        `sd:126 - Failed to add entity '${entityName}': "${err.message}"!!!`,
      )
      throw getResponceOfException(err)
    }
  }

/**
 * 
 * @param results 
 * @param entityName 
 * @param entityRepository 
 */
  private async prioritySaveEntities<T>(
    results: T[],
    entityName: string,
    entityRepository: Repository<T>,
  ): Promise<void> {
    results.forEach(async (result: any) => {
      if (entityName === 'species') {
        if (result.homeworld) {
          result.homeworld = await extractIdFromURL(result.homeworld)
        } else result.homeworld = null
      }
    })
    console.log(`sd:150 - Data for saving ${entityName}: `, results[0]) /////////////////////////////////////
    //entityRepository.save(results)
  }

  /**
   * Сохранение данных сущности в базе данных с заполнением её связанных данных.
   *
   * @param results Массив данных сущностей.
   * @param entityName Имя сущности.
   * @param entityRepository Репозиторий сущности.
   */
  private async saveEntities<T extends Record<string, unknown>>(
    results: T[],
    entityName: string,
    entityRepository: Repository<T>,
  ): Promise<void> {
    for (const object of results) {
      // Заполнение связанных данных сущности.
      const filledObject: DeepPartial<T> = (await this.addRelations(
        entityName,
        object,
      )) as DeepPartial<T>
      //console.log(`sd:172 - Data for saving ${entityName}: `, filledObject) /////////////////////////////////////
      // Сохранение полученных данных сущности в БД.
      await entityRepository.save(filledObject)
    }
  }

  /**
   * Добавляет связанные сущности к объекту данных сущности.
   *
   * @param entityName Имя сущности, для которой добавляются связанные сущности.
   * @param object Объект данных сущности, к которому добавляются связанные сущности.
   * @returns Обновленный объект данных сущности с уже добавленными связанными сущностями.
   */
  private async addRelations(
    entityName: string,
    object: Record<string, any>,
  ): Promise<Record<string, any>> {
    // Получение списка связанных сущностей из 'relatedEntitiesMap' для определенной сущности.
    const relatedNames: string[] =
      relatedEntitiesMap[entityName]?.relatedEntities || []
    // Заполнение связанных сущностей
    for (const relationName of relatedNames) {
      // Получение данных связанной сущности
      let relationData: string | string[] = object[relationName]
      // Данные по связанной сущности отсутствуют => инициализация соответствующего поля
      if (!relationData) {
        object[relationName] =
          Array.isArray(relationData) || relationName === 'images' ? [] : null
        // console.log(
        //   `sd:195 - No related data found for '${relationEntity}' in '${entityName}'. Installed by default...`,
        // )
        continue
      }
      // Замена всех полей с 'Url-адресами' данного объекта на локальные
      relationData = await urlsTransformObject(
        object,
        relationData,
        relationName,
      ) // Просмотреть логику в этом месте!!!!!!!!!!!!
    }
    return object

    /**
     *
     * @param object Объект данных.
     * @param relationData
     * @param relationEntity
     * @returns
     */
    async function urlsTransformObject(
      object: Record<string, any>,
      relationData: string | string[],
      relationEntity: string,
    ) {
      try {
        let idFromUrl: number
        // Замена основного Url-а объекта на локальный
        object.url = await replaceUrl(object.url)
        if (Array.isArray(relationData)) {
          // Обработка массива URL
          relationData = await Promise.all(
            relationData.map(async (url: string) => await replaceUrl(url)),
          )
        } else if (typeof relationData === 'string') {
          // Обработка одного URL
          object[relationEntity] = await extractIdFromURL(relationData)
        }
      } catch (error) {
        console.error(
          `sd:202 - Ошибка при замене URL для '${relationEntity}': ${error.message}`,
        )
        object[relationEntity] = Array.isArray(relationData) ? [] : null
      }
      return relationData
    }
  }
}
