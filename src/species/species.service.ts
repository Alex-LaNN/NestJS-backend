import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Species } from 'src/species/entities/species.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { getResponceOfException } from 'src/shared/common.functions'
import { localUrl, relatedEntitiesMap } from 'src/shared/constants'

/**
 * SpeciesService class
 *
 * This class represents the service layer for managing Species entities in the application.
 * It handles various operations related to Species data, including creation, retrieval,
 * updating, and deletion. It interacts with the database using TypeORM repositories
 * and handles error handling and related entity management.
 */
@Injectable()
export class SpeciesService {
  /**
   * Array of related entity names for Species
   *
   * This array defines the related entities that are associated with Species,
   * such as 'residents', 'films', and 'homeworld'. These entities are populated
   * when creating or updating Species records.
   */
  private readonly relatedEntities: string[]
  /**
   * Constructor for SpeciesService
   *
   * Injects the repositories for Species, People, Films, and Planets.
   *
   * @param speciesRepository - Repository for Species entities
   * @param repositories - Object containing repositories for related entities
   */
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    // Injections of repositories for related entities.
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Planet)
    private readonly planetsRepository: Repository<Planet>,
  ) {
    this.relatedEntities = relatedEntitiesMap.species.relatedEntities
  }

  /**
   * Creates a new Species record
   *
   * This method creates a new Species entity in the database based on the provided data
   * in the `createSpeciesDto` parameter. It checks for existing Species with the same
   * name, throws an error if such a species exists, and otherwise creates a new Species
   * object, populates its properties, and saves it to the database.
   *
   * @param createSpeciesDto - Data transfer object containing Species creation data
   * @returns Promise<Species> - Promise resolving to the created Species entity
   * @throws HttpException - Error with code HttpStatus.FORBIDDEN if Species with the same name exists
   */
  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    try {
      // Check for existing Species with the same name
      const existsSpecies: Species = await this.speciesRepository.findOne({
        where: { name: createSpeciesDto.name },
      })
      if (existsSpecies) {
        console.error(`Species '${createSpeciesDto.name}' already exists!`)
        return null
      }

      // Create a new Species object
      const newSpecies: Species = new Species()
      // Get the last inserted ID
      const lastIdResult = await this.speciesRepository.query(
        'SELECT MAX(id) as maxId FROM species',
      )
      const nextId: number =
        lastIdResult.length > 0 ? lastIdResult[0].maxId + 1 : 1
      newSpecies.url = `${localUrl}species/${nextId}/`
      // Populate Species properties from createSpeciesDto
      for (const key in createSpeciesDto) {
        if (key !== 'url' && !this.relatedEntities.includes(key)) {
          newSpecies[key] = createSpeciesDto[key]
        }
      }

      // Save the new species to the database without related entities
      const savedSpecies = await this.speciesRepository.save(newSpecies)

      // Update URL if necessary
      if (savedSpecies.id !== nextId) {
        console.warn(
          `Predicted ID (${nextId}) doesn't match actual ID (${savedSpecies.id}). Updating URL...`,
        )
        await this.speciesRepository.query(
          'UPDATE species SET url = ? WHERE id = ?',
          [`${localUrl}species/${savedSpecies.id}/`, savedSpecies.id],
        )
        savedSpecies.url = `${localUrl}species/${savedSpecies.id}/`
      }

      // Populate related entities
      await this.fillRelatedEntities(savedSpecies, createSpeciesDto)

      // Fetch the updated film to reflect all changes
      const updatedSpecies: Species = await this.speciesRepository.findOne({
        where: { id: savedSpecies.id },
        relations: this.relatedEntities,
      })
      // Save the new Species entity to the database
      return updatedSpecies
    } catch (error) {
      throw new Error(error)
      //throw getResponceOfException(error)
    }
  }

  /**
   * Retrieves a paginated list of Species
   *
   * This method fetches a paginated list of Species entities from the database using
   * the `paginate` function from `nestjs-typeorm-paginate`. It takes `options` of type
   * `IPaginationOptions` as a parameter, which defines the pagination parameters
   * (e.g., page number, page size, sort order). It returns a `Promise` that resolves
   * to a `Pagination<Species>` object, containing the paginated list of Species
   * entities along with pagination information.
   *
   * @param options - Pagination options (object of type `IPaginationOptions`)
   * @returns Promise<Pagination<Species>> - Promise resolving to a paginated list of Species
   * @throws HttpException - Error with code HttpStatus.INTERNAL_SERVER_ERROR if an error occurs
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Species>> {
    try {
      return paginate<Species>(this.speciesRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves a Species entity by its ID
   *
   * This method retrieves a single Species entity from the database based on the
   * provided `speciesId` parameter. It uses the `findOne` method of the
   * `speciesRepository` to fetch the Species record with the corresponding ID.
   * It returns a `Promise` that resolves to the `Species` entity if found,
   * or `null` if no record is found.
   *
   * @param speciesId - ID of the Species entity (number)
   * @returns Promise<Species> - Promise resolving to the Species entity or `null` if not found
   * @throws HttpException - Error with code HttpStatus.NOT_FOUND if the record is not found
   */
  async findOne(speciesId: number) {
    const species: Species = await this.speciesRepository.findOne({
      where: {
        id: speciesId,
      },
    })
    if (!species) {
      throw new HttpException('Species not found!', HttpStatus.NOT_FOUND)
    }
    return species
  }

  /**
   * Updates an existing Species entity
   *
   * This method updates an existing Species entity in the database based on the
   * provided `speciesId` and `updateSpeciesDto` parameters. It retrieves the existing
   * Species record using `findOne`, updates its properties based on the data in
   * `updateSpeciesDto`, and saves the updated entity to the database.
   * It returns a `Promise` that resolves to the updated `Species` entity.
   *
   * @param speciesId - ID of the Species entity to update (number)
   * @param updateSpeciesDto - Data transfer object containing Species update data
   * @returns Promise<Species> - Promise resolving to the updated Species entity
   * @throws HttpException - Error with code HttpStatus.NOT_FOUND if the record is not found
   */
  async update(
    speciesId: number,
    updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    try {
      const species: Species = await this.findOne(speciesId)
      // Update Species properties based on updateSpeciesDto
      for (const key in updateSpeciesDto) {
        if (updateSpeciesDto.hasOwnProperty(key) && updateSpeciesDto[key]) {
          species[key] = updateSpeciesDto[key]
        }
      }
      // Update 'edited' field with current timestamp
      species.edited = new Date()
      // Update related entities
      await this.fillRelatedEntities(species, updateSpeciesDto)
      // Save the updated Species entity to the database
      return await this.speciesRepository.save(species)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Deletes a Species entity by its ID
   *
   * This method removes an existing Species entity from the database based on the
   * provided `speciesId` parameter. It first retrieves the Species record using
   * `findOne`. If the record is found, it uses the `remove` method of the
   * `speciesRepository` to delete it. It returns a `Promise` that resolves to `void`
   * if the deletion is successful, or throws an `HttpException` with code
   * HttpStatus.NOT_FOUND if the record is not found, or re-throws any other error.
   *
   * @param speciesId - ID of the Species entity to delete (number)
   * @returns Promise<void> - Promise resolving to `void` if deletion is successful
   * @throws HttpException - Error with code HttpStatus.NOT_FOUND if the record is not found
   */
  async remove(speciesId: number): Promise<Species> {
    const species: Species = await this.findOne(speciesId)
    return await this.speciesRepository.remove(species)
  }

  /**
   * Fills related entities for a new or updated Species record
   *
   * This private helper method handles populating related entities for a Species
   * record when creating a new record or updating an existing one. It iterates
   * through the `relatedEntities` array, which defines the related entity names
   * (e.g., 'homeworld', 'residents', 'films').
   *
   * - For the 'homeworld' entity, it constructs a URL based on `localUrl` and the
   *   provided URL in `newSpeciesDto`. It then finds the corresponding Planet entity
   *   based on the URL and assigns it to the `homeworld` property of the Species object.
   * - For other related entities, it iterates through the array of URLs provided
   *   in `newSpeciesDto` for that specific entity key. For each URL, it finds the
   *   corresponding entity using the appropriate repository and assigns it to the
   *   corresponding array property within the Species object (e.g., `residents`, `films`).
   *
   * @param species - Species entity object
   * @param newSpeciesDto - Data transfer object containing Species creation or update data
   * @returns Promise<void> - Promise resolving to `void` after populating related entities
   */
  private async fillRelatedEntities(
    species: Species,
    speciesDto: CreateSpeciesDto | UpdateSpeciesDto,
  ): Promise<void> {
    let tableName: string
    let firstParameter: string
    try {
      for (const key of this.relatedEntities) {
        if (key === 'homeworld' && speciesDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${speciesDto.homeworld}/`
          const planet: Planet = await this.planetsRepository.findOne({
            where: { url: urlToSearch },
          })
          species.homeworld = planet
        } else if (speciesDto[key]) {
          const entities = await Promise.all(
            speciesDto[key].map(async (url: string) => {
              const repository = this.getRepositoryByKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((e: null) => e !== null)

          // Use raw query to insert relations, ignoring duplicates
          if (validEntities.length > 0) {
            tableName = `${key}_species`
            firstParameter = `${key}Id`

            const values = validEntities
              .map((entity: { id: number }) => `(${entity.id}, ${species.id})`)
              .join(',')
            await this.speciesRepository.query(
              `INSERT IGNORE INTO ${tableName} (${firstParameter}, speciesId) VALUES ${values}`,
            )
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Retrieves the appropriate repository based on the given key.
   *
   * This private helper method returns the correct TypeORM repository
   * based on the provided key. The key is expected to be one of the
   * related entity types (e.g., 'films', 'starships', 'species', 'vehicles',
   * 'homeworld'). If the key does not match any of these, an error is thrown.
   *
   * @param key The key representing the type of related entity
   * @returns The corresponding TypeORM repository for the given key
   * @throws Error if no repository is found for the given key
   */
  private getRepositoryByKey(key: string): Repository<any> {
    switch (key) {
      case 'people':
        return this.peopleRepository
      case 'films':
        return this.filmsRepository
      case 'homeworld':
        return this.planetsRepository
      default:
        throw new Error(`No repository found for key: ${key}`)
    }
  }
}
