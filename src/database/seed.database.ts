import {
  ApiResponse,
  BaseEntity,
  ExtendedBaseEntity,
  entityClasses,
  entityClassesForFill,
  relatedEntitiesMap,
  swapiUrl,
} from 'src/shared/constants'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import fetch from 'cross-fetch'
import {
  extractIdFromUrl,
  findNameAndDataOfRelationEntity,
  getObjectNameFromUrl,
  getResponceOfException,
  replaceUrlWithLocal,
  setObjectField,
} from 'src/shared/common.functions'
import { InjectDataSource } from '@nestjs/typeorm'
import { runMigrations } from './migrate'
import { dbName } from './config'

/**
 * SeedDatabase Class: Manages Database Seeding from a Remote Source
 *
 * This class handles the process of filling the local database with data from a remote
 * source, such as SWAPI. It utilizes TypeORM and various helper functions to fetch,
 * process, and save data to the database.
 */
export class SeedDatabase {
  // Property to store the QueryRunner instance
  public queryRunner: QueryRunner
  /**
   * Constructor: Initializes the QueryRunner and sets the data source
   *
   * @param dataSource The injected TypeORM data source
   */
  constructor(@InjectDataSource() public readonly dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner()
  }

  /**
   * Synchronizes the local database with the remote data source.
   *
   * This method checks if the database is empty, runs migrations if necessary, and
   * then fills the database with data from the remote source. If an error occurs
   * during the process, the transaction is rolled back.
   */
  synchronizeDatabase = async () => {
    this.queryRunner = this.dataSource.createQueryRunner()

    // Check if the database already contains data
    const isDatabaseEmpty = await this.isDatabaseEmpty()
    if (!isDatabaseEmpty) {
      console.log('Database is already filled, skipping seeding...')
      return
    }
    // Run database migrations if not already done
    await runMigrations(this.queryRunner)
    try {
      // Start a transaction to ensure data consistency
      await this.queryRunner.startTransaction()
      console.log(`Start filling the database...`)
      // Fill the database with data for each entity
      for (const entityName of Object.keys(entityClassesForFill)) {
        await this.addData(entityName)
      }
      // Commit the transaction to make changes permanent
      await this.queryRunner.commitTransaction()
      console.log('All database additions are completed, ok!...')
    } catch (error) {
      // Roll back the transaction in case of errors
      await this.queryRunner.rollbackTransaction()
      console.error(
        'seed.dat:76 - Error during database synchronization: ',
        error,
      )
      throw getResponceOfException(error)
    } finally {
      // Release the QueryRunner resource to avoid memory leaks
      await this.queryRunner.release()
    }
  }

  /**
   * Adds data for a specific entity to the database.
   *
   * This method fetches data from the remote source (SWAPI), processes the data,
   * and saves it to the local database.
   * If the entity is 'people' or 'films', it also handles related data.
   *
   * @param entityName The name of the entity to add data for.
   */
  private async addData<T extends BaseEntity>(
    entityName: string,
  ): Promise<void> {
    // Get the TypeORM repository for the given entity
    const entityRepository: Repository<T> =
      await this.getRepositoryForEntity<T>(entityName)
    if (!entityRepository)
      throw new Error(`Repository for '${entityName}' not received!!!`)
    try {
      console.log(`seed.dat:104 - Start fill DB an entity ${entityName}...`)
      // Construct the URL for fetching data from SWAPI
      let next: string | null = `${swapiUrl}${entityName}/`
      //let next: string | null = `<span class="math-inline">\{swapiUrl\}</span>{entityName}/`
      // Variable to store results from each page
      let results: T[] = []
      // Loop through paginated data from SWAPI
      do {
        // Fetch data from SWAPI
        const response: Response = await fetch(next)
        if (!response.ok) {
          throw new Error(
            `seed.dat:116 - Failed to fetch data for '${entityName}', received: '${response.statusText}'`,
          )
        }
        // Parse the response into an ApiResponse object
        const apiResponse: ApiResponse<T> = await response.json()
        // Check the response type and handle data accordingly
        if ('results' in apiResponse) {
          // Multiple results found
          results = apiResponse.results
          next = apiResponse.next
        } else {
          // Single result found
          results = [apiResponse.data]
          next = null
        }
        // Process and save the fetched data
        await this.saveDataToDB<T>(results, entityName, entityRepository)
        // Fill related data for 'people' and 'films' entities
        if (entityName === 'people' || entityName === 'films') {
          await this.fillRelatedData(entityName, results)
        }
      } while (next)
      console.log(`seed.dat:138 - Entity '${entityName}' added ok...`)
    } catch (error) {
      console.error(
        `seed.dat:141 - Error when filling database with entity '${entityName}': "${error.message}"!!!`,
      )
      throw getResponceOfException(error)
    }
  }

  /**
   * Saves the fetched data to the local database.
   *
   * This method processes each object in the fetched data, modifies it as necessary,
   * and then saves it to the local database using the provided repository.
   *
   * @param results The array of fetched data objects.
   * @param entityName The name of the entity being processed.
   * @param entityRepository The repository for the entity.
   */
  private async saveDataToDB<T extends ExtendedBaseEntity>(
    results: T[],
    entityName: string,
    entityRepository: Repository<T>,
  ): Promise<void> {
    // Check for invalid arguments
    if (!results || !entityRepository) {
      throw new Error(
        `seed.dat:165 - Invalid arguments: 'results' or 'entityRepository' are null or undefined.`,
      )
    }
    // Process and modify each object before saving
    const modifiedObjects: T[] = await Promise.all(
      results.map(async (object) => {
        // Check if the object has a 'url' property
        if (!object.url) {
          throw new Error(`Object does not have a 'url' property`)
        }
        // Replace URLs with local URLs
        object.url = await replaceUrlWithLocal(object.url)
        // Extract ID from URL and assign it to the object's ID property
        object.id = (await extractIdFromUrl(object.url)) as number
        // Handle specific fields for 'people' and 'species' entities
        if (entityName === 'people' || entityName === 'species') {
          const url = object.homeworld
          const idFromUrl = (await extractIdFromUrl(url)) as number
          object.homeworld = object.homeworldId = idFromUrl
        }
        // Handle specific fields for 'planets' entities
        if (entityName === 'planets') {
          const url = object.residents
          object.residents = object.residentsId = (await extractIdFromUrl(
            url,
          )) as number[]
        }
        return object
      }),
    )
    // Save the modified objects to the database
    await entityRepository.save(modifiedObjects)
  }

  /**
   * Fills related data for an entity.
   *
   * This method processes related data fields for an entity, replaces URLs with local URLs,
   * and saves the related data to the database.
   *
   * @param entityName The name of the entity being processed.
   * @param objects The array of entity objects.
   */
  private async fillRelatedData<T extends ExtendedBaseEntity>(
    entityName: string,
    objects: T[],
  ): Promise<void> {
    // Get the related entities for the given entity
    const relatedNames: string[] =
      relatedEntitiesMap[entityName]?.relatedEntities || []
    // Iterate through each object in the array
    for (const object of objects) {
      // Fill related data for each related entity name
      for (const relationName of relatedNames) {
        // Get the updated related data URL
        const updatedRelationData: string | string[] =
          await this.changeUrlsObject(
            object,
            object[relationName],
            relationName,
          )
        // Convert the updated data to the correct type
        const typedUpdatedRelationData =
          updatedRelationData as T[typeof relationName]
        // Set the updated related data on the object
        setObjectField(object, relationName, typedUpdatedRelationData)
        // Get the original related data from the object
        let relationDataForObject: string | string[] = object[relationName]
        // Initialize the related data field if it's missing or for 'images'
        if (relationName === 'images' || !relationDataForObject) {
          setObjectField(
            object,
            relationName,
            Array.isArray(relationDataForObject) ? ([] as any) : null,
          )
          continue
        }
        // Process the related data field of the object
        try {
          // Get the ID of the object being processed
          const objectIdToInsert: number | number[] = await extractIdFromUrl(
            object.url,
          )
          // Get the name and related data ID of the related entity
          const { nameOfRelationEntity, relationDataIdToInsert } =
            await findNameAndDataOfRelationEntity(relationDataForObject)
          // Handle special case for 'homeworld'
          if (relationName === 'homeworld') {
            const tableNameForInsert: string = await getObjectNameFromUrl(
              object.url,
            )
            await this.queryRunner.query(
              `INSERT INTO ${dbName}.${tableNameForInsert} (${relationName}Id) VALUES (?)`,
              [relationDataIdToInsert],
            )
          }
          // Get the table name for inserting the related data
          const tableNameForInsert: string = `${dbName}.${entityName}_${nameOfRelationEntity}`
          if (tableNameForInsert === `${dbName}.films_people`) {
            continue
          }
          // Check if `relationDataIdToInsert` is an array
          if (Array.isArray(relationDataIdToInsert)) {
            for (const id of relationDataIdToInsert) {
              // Insert each element of the array into the database
              await this.queryRunner.query(
                `INSERT INTO ${tableNameForInsert} (${entityName}Id, ${nameOfRelationEntity}Id) VALUES (?, ?)`,
                [objectIdToInsert, id],
              )
            }
          } else {
            // Insert the data if `relationDataIdToInsert` is not an array
            await this.queryRunner.query(
              `INSERT INTO ${tableNameForInsert} (${entityName}Id, ${nameOfRelationEntity}Id) VALUES (?, ?)`,
              [objectIdToInsert, relationDataIdToInsert],
            )
          }
        } catch (error) {
          // Ignore non-critical errors (don't affect database population)
        }
      }
    }
  }

  /**
   * Replaces URLs in an object with local URLs.
   *
   * This method processes URLs in an object's related data fields and replaces them with local URLs.
   *
   * @param object The object containing URLs to replace.
   * @param relationData The related data containing URLs.
   * @param relationName The name of the related entity field.
   * @returns The updated related data with local URLs.
   */
  private async changeUrlsObject(
    object: Record<string, any>,
    relationData: string | string[],
    relationName: string,
  ): Promise<string | string[]> {
    try {
      // Replace the main URL of the object with a local URL
      object.url = await replaceUrlWithLocal(object.url)
      if (Array.isArray(relationData)) {
        // Handle an array of URLs
        relationData = await Promise.all(
          relationData.map(
            async (url: string) => await replaceUrlWithLocal(url),
          ),
        )
      } else if (typeof relationData === 'string') {
        // Handle a single URL
        // Extract the ID from the URL and store it in the object's related entity field
        object[relationName] = await extractIdFromUrl(relationData)
      }
    } catch (error) {
      console.error(
        `seed.dat:321 - Error replacing URL for '${relationName}': ${error.message}. URL missing!`,
      )
      // Set default values in case of errors (URL missing)
      object[relationName] = Array.isArray(relationData) ? [] : null
    }
    return relationData
  }

  /**
   * Retrieves the TypeORM repository for a given entity.
   *
   * This method retrieves the repository for an entity from the QueryRunner's manager.
   *
   * @param entityName The name of the entity.
   * @returns The repository for the entity.
   */
  private async getRepositoryForEntity<T extends BaseEntity>(
    entityName: string,
  ) {
    let entityRepository: Repository<T>
    try {
      entityRepository = this.queryRunner.manager.getRepository<T>(
        entityClasses[entityName],
      )
    } catch (error) {
      throw new Error(`seed.dat:346 - No metadata found for '${entityName}'`)
    }
    return entityRepository
  }

  /**
   * Checks if the database is empty.
   *
   * This method checks if the database contains any data for the entities specified
   * in the `entityClassesForFill` configuration. It returns `true` if the database is
   * empty, and `false` otherwise.
   *
   * @returns A boolean indicating whether the database is empty.
   */
  private async isDatabaseEmpty(): Promise<boolean> {
    try {
      for (const entityName of Object.keys(entityClassesForFill)) {
        const repository = await this.getRepositoryForEntity(entityName)

        // Check if table exists
        const tableName = repository.metadata.tableName
        const tableExistsQuery = `SHOW TABLES LIKE '${tableName}'`
        const tableExistsResult = await this.queryRunner.query(tableExistsQuery)
        if (tableExistsResult.length === 0) {
          // If table doesn't exist, consider the database empty
          return true
        }

        // Count the number of records in the table
        const count = await repository.count()
        if (count > 0) {
          return false
        }
      }
      return true
    } catch (error) {
      console.error('Error checking database contents: ', error)
      throw getResponceOfException(error)
    }
  }
}
