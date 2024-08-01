import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateStarshipDto } from './dto/create-starship.dto'
import { UpdateStarshipDto } from './dto/update-starship.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Starship } from 'src/starships/entities/starship.entity'
import { Repository } from 'typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import {
  extractIdFromUrl,
  getResponceOfException,
} from 'src/shared/common.functions'
import { localUrl, relatedEntitiesMap } from 'src/shared/constants'

/**
 * StarshipsService class
 *
 * This class represents the service layer for managing Starship entities in the application.
 * It handles various operations related to Starship data, including creation, retrieval,
 * updating, and deletion. It interacts with the database using TypeORM repositories
 * and handles error handling and related entity management.
 */
@Injectable()
export class StarshipsService {
  private readonly relatedEntities: string[]
  /**
   * Constructor for StarshipsService
   *
   * Injects the repositories for Starships, People, and Films.
   *
   * @param starshipsRepository - Repository for Starship entities
   * @param repositories - Object containing repositories for related entities
   */
  constructor(
    @InjectRepository(Starship)
    private readonly starshipsRepository: Repository<Starship>,
    // Inject repositories for related entities (pilots, films)
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
  ) {
    this.relatedEntities = relatedEntitiesMap.starships.relatedEntities
  }

  /**
   * Creates a new Starship record
   *
   * This method creates a new Starship entity in the database based on the data
   * provided in the `createStarshipDto` parameter. It checks if there is a Starship
   * with the same name, returns null if such a starship exists, and otherwise
   * creates a new Starship object, populates its properties, and saves it to the database.
   *
   * @param createStarshipDto - Data transfer object containing Starship creation data
   * @returns Promise<Starship> - Promise resolving to the created Starship entity
   */
  async create(createStarshipDto: CreateStarshipDto) {
    try {
      const existsStarship: Starship = await this.starshipsRepository.findOne({
        where: { name: createStarshipDto.name },
      })
      if (existsStarship) {
        console.error(`Starship '${createStarshipDto.name}' already exists!`)
        return null
      }

      const newStarship: Starship = new Starship()
      // Finding the last starship's ID
      const nextIdForNewStarship: number = await this.getNextIdForNewStarship()
      newStarship.url = `${localUrl}starships/${nextIdForNewStarship}/`
      // Iterate through the DTO fields and populate the 'newStarship' object
      for (const key in createStarshipDto) {
        newStarship[key] = this.relatedEntities.includes(key)
          ? []
          : createStarshipDto[key]
      }
      // Filling in related entities.
      await this.fillRelatedEntities(newStarship, createStarshipDto)
      return await this.starshipsRepository.save(newStarship)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Retrieves a paginated list of Starships
   *
   * This method fetches a paginated list of Starship entities from the database using
   * the `paginate` function from `nestjs-typeorm-paginate`. It takes `options` of type
   * `IPaginationOptions` as a parameter, which defines the pagination parameters
   * (e.g., page number, page size, sort order). It returns a `Promise` that resolves
   * to a `Pagination<Starship>` object, containing the paginated list of Starship
   * entities along with pagination information.
   *
   * @param options - Pagination options (object of type `IPaginationOptions`)
   * @returns Promise<Pagination<Starship>> - Promise resolving to a paginated list of Starships
   * @throws HttpException - Error with code HttpStatus.INTERNAL_SERVER_ERROR if an error occurs
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Starship>> {
    try {
      return paginate<Starship>(this.starshipsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves a Starship entity by its ID
   *
   * This method retrieves a single Starship entity from the database based on the
   * provided `starshipId` parameter. It uses the `findOne` method of the
   * `starshipsRepository` to fetch the Starship record with the corresponding ID.
   * It returns a `Promise` that resolves to the `Starship` entity if found,
   * or `null` if no record is found.
   *
   * @param starshipId - ID of the Starship entity (number)
   * @returns Promise<Starship> - Promise resolving to the Starship entity or `null` if not found
   */
  async findOne(starshipId: number) {
    const starship: Starship = await this.starshipsRepository.findOne({
      where: {
        id: starshipId,
      },
    })
    // Return the Starship entity or 'null'
    return starship
  }

  /**
   * Updates an existing Starship entity
   *
   * This method updates an existing Starship entity in the database based on the
   * provided `starshipId` and `updateStarshipDto` parameters. It retrieves the existing
   * Starship record using `findOne`, updates its properties based on the data in
   * `updateStarshipDto`, and saves the updated entity to the database.
   * It returns a `Promise` that resolves to the updated `Starship` entity.
   *
   * @param starshipId - ID of the Starship entity to update (number)
   * @param updateStarshipDto - Data transfer object containing Starship update data
   * @returns Promise<Starship> - Promise resolving to the updated Starship entity
   * @throws HttpException - Error with code HttpStatus.INTERNAL_SERVER_ERROR if an error occurs
   */
  async update(
    starshipId: number,
    updateStarshipDto: UpdateStarshipDto,
  ): Promise<Starship> {
    try {
      const starship: Starship = await this.findOne(starshipId)
      // Return null if not found
      if (!starship) return null
      // Update 'starship' properties based on data from 'updateStarshipDto'
      for (const key in updateStarshipDto) {
        if (updateStarshipDto.hasOwnProperty(key) && updateStarshipDto[key]) {
          starship[key] = updateStarshipDto[key]
        }
      }
      // Update the 'edited' field
      starship.edited = new Date()
      // Update data about 'Starship'
      await this.fillRelatedEntities(starship, updateStarshipDto)
      return await this.starshipsRepository.save(starship)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Deletes a Starship entity by its ID
   *
   * This method removes an existing Starship entity from the database based on the
   * provided `starshipId` parameter. It first retrieves the Starship record using
   * `findOne`. If the record is found, it uses the `remove` method of the
   * `starshipsRepository` to delete it. It returns a `Promise` that resolves to `void`
   * if the deletion is successful.
   *
   * @param starshipId - ID of the Starship entity to delete (number)
   * @returns Promise<void> - Promise resolving to `void` if deletion is successful
   */
  async remove(starshipId: number): Promise<Starship> {
    const starship: Starship = await this.findOne(starshipId)
    return await this.starshipsRepository.remove(starship)
  }

  /**
   * Fills related entities for a new or updated Starship record
   *
   * This private helper method handles populating related entities for a Starship
   * record when creating a new record or updating an existing one. It iterates
   * through the `relatedEntities` array, which defines the related entity names
   * (e.g., 'pilots', 'films').
   *
   * For each related entity, it iterates through the array of URLs provided
   * in `newStarshipDto` for that specific entity key. For each URL, it finds the
   * corresponding entity from the repository and adds it to the Starship's
   * related entity array.
   *
   * @param starship - Starship entity to fill related entities for
   * @param newStarshipDto - Data transfer object containing Starship creation or update data
   * @returns Promise<void> - Promise resolving to `void` upon successful completion
   * @throws HttpException - Error if any related entity cannot be found or any other error occurs
   */
  private async fillRelatedEntities(
    starship: Starship,
    newStarshipDto: CreateStarshipDto | UpdateStarshipDto,
  ): Promise<void> {
    try {
      await Promise.all(
        this.relatedEntities.map(async (key) => {
          if (newStarshipDto[key]) {
            starship[key] = await Promise.all(
              newStarshipDto[key].map(async (elem: string) => {
                const repository = this.getRepositoryByKey(key)
                const entity = await repository.findOne({
                  where: { url: elem },
                })
                return entity
              }),
            )
          }
        }),
      )
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Retrieves the appropriate repository based on the given key.
   *
   * This private helper method returns the correct TypeORM repository
   * based on the provided key. The key is expected to be one of the
   * related entity types (e.g., 'films', 'pilots').
   * If the key does not match any of these, an error is thrown.
   *
   * @param key The key representing the type of related entity
   * @returns The corresponding TypeORM repository for the given key
   * @throws Error if no repository is found for the given key
   */
  private getRepositoryByKey(key: string): Repository<any> {
    switch (key) {
      case 'pilots':
        return this.peopleRepository
      case 'films':
        return this.filmsRepository
      default:
        throw new Error(`No repository found for key: ${key}`)
    }
  }

  /**
   * Get the next ID for a new starship
   *
   * This private method retrieves the highest ID currently used by starships in the database,
   * and returns the next ID to be used for a new starship.
   * It queries the database for the starship with the highest ID, extracts the numeric ID from its URL,
   * and increments it to obtain the next ID.
   *
   * @returns A Promise resolving to the next ID for a new starship (number)
   */
  private async getNextIdForNewStarship(): Promise<number> {
    const lastStarship = await this.starshipsRepository.query(`
      SELECT url FROM starships ORDER BY id DESC LIMIT 1
      `)
    // Default ID if there are no starships in the database
    let nextId = 1

    if (lastStarship.length > 0 && lastStarship[0].url) {
      // Use the extractIdFromUrl function to get the last ID
      const lastId = (await extractIdFromUrl(lastStarship[0].url)) as number
      nextId = lastId + 1 // Increment the ID for the new starship
    }
    return nextId
  }
}
