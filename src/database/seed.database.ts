import {
  SwapiResponse,
  entityClasses,
  localUrl,
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
import { getResponceOfException } from 'src/shared/common.functions'
import { AbstractEntity } from 'src/shared/abstract.entity'
import { InjectDataSource } from '@nestjs/typeorm'

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
    //await this.dataSource.initialize()
    this.queryRunner = this.dataSource.createQueryRunner()
    try {
      await this.queryRunner.startTransaction()
      console.log(`Data source initialized. Let's start seeding...`)
      // Цикл по всем сущностям для заполнения БД
      for (const entityName of Object.keys(entityClasses)) {
        await this.addData(entityName)
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
    }
  }

  /**
   *  Добавление данных в БД для определенной сущности.
   *
   * @param entityName Имя сущности.
   */
  private async addData<T extends Record<string, unknown>>(
    entityName: string,
  ): Promise<void> {
    try {
      // Получение репозитория TypeORM для данной сущности.
      const entityRepository: Repository<T> =
        this.queryRunner.manager.getRepository<T>(entityClasses[entityName])
      // Формирование URL-адреса для запроса к SWAPI.
      const urlForRequest: string = `${swapiUrl}${entityName}/`
      // Запрос к SWAPI (Star Wars API) для получения всех доступных ресурсов типа 'entityName'.
      let response: Response = await fetch(urlForRequest)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data for ${entityName}: ${response.statusText}`,
        )
      }
      // Извлечение массива результатов и 'URL' следующей страницы из полученного ответа сервера для дальнейшей обработки списка объектов сущности.
      let data: SwapiResponse<T> = (await response.json()) as SwapiResponse<T>
      let { results, next } = data
      console.log(`sd:81 - 'Results[0]' for '${entityName}': `, results[0]) ////////////////////////////
      while (next) {
        // Для каждого элемента в массиве ответа сервера 'results' (отображаемой страницы)
        await this.saveEntities<T>(results, entityName, entityRepository)
        response = await fetch(next)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data for ${entityName}: ${response.statusText}!!!`,
          )
        }
        data = (await response.json()) as SwapiResponse<T>
        // Обновление значений 'results' и 'next' для следующей итерации.
        ;({ results, next } = data)
      }
    } catch (err) {
      console.error(
        `sd:97 - Failed to add entity '${entityName}': ${err.message}!!!`,
      )
      throw getResponceOfException(err)
    }
  }

  /**
   * Сохранение данных сущности в базе данных.
   *
   * @param results Массив данных сущностей.
   * @param entityName Имя сущности.
   * @param entityRepository Репозиторий сущности.
   */
  private async saveEntities<T extends Record<string, unknown>>(
    results: any[],
    entityName: string,
    entityRepository: Repository<T>,
  ) {
    for (const object of results) {
      // Извлечение полученных данных сущности(в переменную 'entity'), исключая поля 'created' и 'edited'.
      const { created, edited, ...entity } = object as AbstractEntity<T>
      // Заполнение связанных данных сущности.
      const filledObject = (await this.addRelations(
        entityName,
        entity,
      )) as DeepPartial<T>

      console.log(`sd:124 - Data for saving ${entityName}: `, filledObject) /////////////////////////////////////

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
    const relatedEntities: string[] =
      //      relatedEntitiesMap[entityName]?.relatedEntities || []
      relatedEntitiesMap[entityName].relatedEntities
    let relatedRepository: Repository<ObjectLiteral>
    // Замена URL-адресов связанных данных у конкретной сущности на локальные URL-адреса.
    //const replaceUrl = (url: string): string => url.replace(swapiUrl, localUrl)
    async function replaceUrl(url: string): Promise<string> {
      return url.replace(swapiUrl, localUrl)
    }
    // Заполнение связанных сущностей
    for (const relationEntity of relatedEntities) {
      try {
        // Получаем репозиторий для связанной сущности
        relatedRepository =
          this.queryRunner.manager.getRepository(relationEntity)
      } catch (error) {
        console.error(
          `sd:157 - Failed to get repository for '${relationEntity}': ${error.message}`,
        )
        throw new Error(`No metadata found for '${relationEntity}'`)
      }
      // Получение данных связанной сущности
      let relationData: string | string[] = object[relationEntity]
      // Данные по связанной сущности отсутствуют => инициализация соответствующего поля
      if (!relationData) {
        object[relationEntity] =
          Array.isArray(relationData) || relationEntity === 'images' ? [] : null
        console.log(
          `sd:168 - No related data found for '${relationEntity}' in '${entityName}'. Installed by default...`,
        )
        continue
      }
      try {
        object.url = await replaceUrl(object.url)
        if (Array.isArray(relationData)) {
          // Обработка массива URL
          relationData = await Promise.all(
            relationData.map(async (url: string) =>
              await replaceUrl(url),
              //extractIdFromUrl(await replaceUrl(url)),
            ),
          )
        } else if (typeof relationData === 'string') {
          // Обработка одного URL
          relationData = await replaceUrl(relationData)
          //relationData = extractIdFromUrl(await replaceUrl(relationData))
        }
        object[relationEntity] = relationData
      } catch (error) {
        console.error(
          `Ошибка при замене URL для '${relationEntity}': ${error.message}`,
        )
        object[relationEntity] = Array.isArray(relationData) ? [] : null
      }
    }
    return object

    function extractIdFromUrl(url: string): string {
      if (url === null || url === undefined) return '0'
      // Извлечение 'id' (последнего числового значения) из 'URL'
      const match = url.match(/\/(\d+)\/?$/)
      if (match) {
        return match[1]
      } else {
        throw new Error(`Invalid URL: ${url}`)
      }
    }
  }
}
