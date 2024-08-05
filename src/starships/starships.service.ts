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
import { getResponceOfException } from 'src/shared/common.functions'
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
   * Creates a new Starship entity.
   *
   * This method handles the creation of a new Starship entity, including checking for existing entities
   * with the same name, setting the URL, populating properties from the DTO, and filling related entities.
   *
   * @param createStarshipDto - The DTO containing data for creating the starship.
   * @returns The created Starship entity with all related entities populated, or null if a starship with the same name already exists.
   * @throws An error if the operation fails.
   */
  async create(createStarshipDto: CreateStarshipDto) {
    try {
      // Check if a starship with the given name already exists
      const existsStarship: Starship = await this.starshipsRepository.findOne({
        where: { name: createStarshipDto.name },
      })
      if (existsStarship) {
        console.error(`Starship '${createStarshipDto.name}' already exists!`)
        return null
      }

      // Create a new starship instance
      const newStarship: Starship = new Starship()
      // Get the last inserted ID to predict the next ID
      const lastIdResult = await this.starshipsRepository.query(
        'SELECT MAX(id) as maxId FROM starships',
      )
      const nextId: number =
        lastIdResult.length > 0 ? lastIdResult[0].maxId + 1 : 1
      // Set the URL for the new starship
      newStarship.url = `${localUrl}starships/${nextId}/`
      // Populate the starship's properties from the DTO, excluding the URL and related entities
      for (const key in createStarshipDto) {
        if (key !== 'url' && !this.relatedEntities.includes(key)) {
          newStarship[key] = createStarshipDto[key]
        }
      }

      // Save the new starship to the database without related entities
      const savedStarship = await this.starshipsRepository.save(newStarship)

      // Update URL if the actual ID does not match the predicted ID
      if (savedStarship.id !== nextId) {
        console.warn(
          `Predicted ID (${nextId}) doesn't match actual ID (${savedStarship.id}). Updating URL...`,
        )
        await this.starshipsRepository.query(
          'UPDATE starships SET url = ? WHERE id = ?',
          [`${localUrl}starships/${savedStarship.id}/`, savedStarship.id],
        )
        savedStarship.url = `${localUrl}starships/${savedStarship.id}/`
      }

      // Fill related entities for the new starship
      await this.fillRelatedEntities(savedStarship, createStarshipDto)

      // Fetch the updated starship to reflect all changes
      const updatedStarships: Starship = await this.starshipsRepository.findOne(
        {
          where: { id: savedStarship.id },
          relations: this.relatedEntities,
        },
      )
      // Return the updated starship
      return updatedStarships
    } catch (error) {
      throw new Error(error)
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
   * Fills related entities for a given Starship.
   *
   * This method populates the related entities for a Starship entity based on the provided DTO.
   * It finds the corresponding related entities in the database, filters out any null values,
   * and inserts the relationships into the appropriate join tables using raw SQL queries.
   *
   * @param starship - The Starship entity to populate related entities for.
   * @param starshipDto - The DTO containing data for creating or updating the starship, including related entities.
   * @returns A promise that resolves when the related entities have been populated.
   * @throws An error if the operation fails.
   */
  private async fillRelatedEntities(
    starship: Starship,
    starshipDto: CreateStarshipDto | UpdateStarshipDto,
  ): Promise<void> {
    let tableName: string
    let firstParameter: string
    try {
      for (const key of this.relatedEntities) {
        if (starshipDto[key]) {
          const entities = await Promise.all(
            starshipDto[key].map(async (url: string) => {
              const repository = this.getRepositoryByKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )
          console.log(`starship.service:255 - entities:`, entities)

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((obj: null) => obj !== null)

          // Use raw query to insert relations, ignoring duplicates
          if (validEntities.length > 0) {
            if (key === 'pilots') {
              tableName = `people_starships`
              firstParameter = `peopleId`
            } else {
              tableName = `${key}_starships`
              firstParameter = `${key}Id`
            }

            const values = validEntities
              .map((entity: { id: number }) => `(${entity.id}, ${starship.id})`)
              .join(',')
            await this.starshipsRepository.query(
              `INSERT IGNORE INTO ${tableName} (${firstParameter}, starshipsId) VALUES ${values}`,
            )
          }
        }
      }
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
}
