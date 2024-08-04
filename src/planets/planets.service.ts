import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePlanetDto } from './dto/create-planet.dto'
import { UpdatePlanetDto } from './dto/update-planet.dto'
import { Planet } from 'src/planets/entities/planet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { localUrl, relatedEntitiesMap } from 'src/shared/constants'
import { getResponceOfException } from 'src/shared/common.functions'

/**
 * PlanetsService
 *
 * This service handles business logic related to planets. It injects
 * repositories for `Planet`, `People`, and `Film` entities to interact with
 * the database. It provides methods for creating, retrieving, updating,
 * and deleting planets, handling related entities (residents and films).
 */
@Injectable()
export class PlanetsService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Planet)
    private readonly planetsRepository: Repository<Planet>,
    // Injections for related entity repositories
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
  ) {
    this.relatedEntities = relatedEntitiesMap.planets.relatedEntities
  }

  /**
   * Creates a new planet
   *
   * This method creates a new planet entity. It checks for existing planets
   * with the same name before creating. It iterates through the properties of
   * the `CreatePlanetDto` and assigns them to the new planet object, except for
   * related entities (residents and films) which are initialized as empty arrays.
   * Then, it calls `fillRelatedEntities` to populate the related entities based
   * on the data in `CreatePlanetDto`. Finally, it saves the new planet to the database.
   *
   * @param createPlanetDto (CreatePlanetDto) The data to create the new planet.
   * @returns Promise<Planet> A promise that resolves to the created Planet entity.
   * @throws HttpException Throws an exception if a planet with the same name already exists.
   */
  async create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    try {
      // Check if a planet with the same name already exists
      const existsPlanet: Planet = await this.planetsRepository.findOne({
        where: { name: createPlanetDto.name },
      })
      if (existsPlanet) {
        console.error(`Planet '${createPlanetDto.name}' already exists!`)
        return null
      }

      // Create a new Planet object
      const newPlanet: Planet = new Planet()
      // Get the last inserted ID
      const lastIdResult = await this.planetsRepository.query(
        'SELECT MAX(id) as maxId FROM planets',
      )
      const nextId: number =
        lastIdResult.length > 0 ? lastIdResult[0].maxId + 1 : 1
      newPlanet.url = `${localUrl}planets/${nextId}/`

      // Populate planet properties from DTO, excluding related entities
      for (const key in createPlanetDto) {
        if (key !== 'url' && !this.relatedEntities.includes(key)) {
          newPlanet[key] = createPlanetDto[key]
        }
      }

      // Save the new planet to the database without related entities
      const savedPlanet = await this.planetsRepository.save(newPlanet)

      // Update URL if necessary
      if (savedPlanet.id !== nextId) {
        console.warn(
          `Predicted ID (${nextId}) doesn't match actual ID (${savedPlanet.id}). Updating URL...`,
        )
        await this.planetsRepository.query(
          'UPDATE planets SET url = ? WHERE id = ?',
          [`${localUrl}films/${savedPlanet.id}/`, savedPlanet.id],
        )
        savedPlanet.url = `${localUrl}planets/${savedPlanet.id}/`
      }

      // Fill in related entities
      await this.fillRelatedEntities(savedPlanet, createPlanetDto)

      // Fetch the updated planet to reflect all changes
      const updatedPlanet: Planet = await this.planetsRepository.findOne({
        where: { id: savedPlanet.id },
        relations: this.relatedEntities,
      })

      return updatedPlanet
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Retrieves a paginated list of all planets
   *
   * This method uses `nestjs-typeorm-paginate` to retrieve a paginated list of
   * all planets from the database. It accepts pagination options (`IPaginationOptions`)
   * to control the page size and number. If an error occurs during retrieval,
   * it throws an `HttpException` with an internal server error message.
   *
   * @param options (IPaginationOptions) The pagination options for retrieving planets.
   * @returns Promise<Pagination<Planet>> A promise that resolves to a paginated list of Planet entities.
   * @throws HttpException Throws an exception if an error occurs during retrieval.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Planet>> {
    try {
      // Use NestJS TypeORM Paginate to retrieve a paginated list of planets
      return paginate<Planet>(this.planetsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves a planet by its ID
   *
   * This method fetches a planet entity from the database based on the provided ID.
   * It uses the `planetsRepository` to find the planet with the matching ID.
   * If the planet is not found, it returns `null`.
   *
   * @param planetId (number) The ID of the planet to retrieve.
   * @returns Promise<Planet> A promise that resolves to the Planet entity with the given ID, or `null` if not found.
   */
  async findOne(planetId: number): Promise<Planet> {
    const planet: Planet = await this.planetsRepository.findOne({
      where: {
        id: planetId,
      },
    })
    return planet
  }

  /**
   * Updates an existing planet
   *
   * This method updates an existing planet entity in the database. It first
   * retrieves the planet using the `findOne` method. Then, it iterates over the
   * properties of the `UpdatePlanetDto` and updates the corresponding properties
   * of the planet object. It also updates the `edited` field with the current date
   * and calls `fillRelatedEntities` to handle any updates to related entities.
   * Finally, it saves the updated planet to the database.
   *
   * @param planetId (number) The ID of the planet to update.
   * @param updatePlanetDto (UpdatePlanetDto) The data to update the planet with.
   * @returns Promise<Planet> A promise that resolves to the updated Planet entity.
   * @throws HttpException Throws an exception if the planet is not found or an error occurs during update.
   */
  async update(
    planetId: number,
    updatePlanetDto: UpdatePlanetDto,
  ): Promise<Planet> {
    try {
      const planet: Planet = await this.findOne(planetId)
      // Return null if not found
      if (!planet) return null
      // Update planet properties based on UpdatePlanetDto
      for (const key in updatePlanetDto) {
        if (updatePlanetDto.hasOwnProperty(key) && updatePlanetDto[key]) {
          planet[key] = updatePlanetDto[key]
        }
      }
      // Update the 'edited' field
      planet.edited = new Date()
      // Populate related entities in the planet
      await this.fillRelatedEntities(planet, updatePlanetDto)
      return this.planetsRepository.save(planet)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Removes a planet by its ID
   *
   * This method deletes a planet entity from the database based on the provided ID.
   * It first retrieves the planet using the `findOne` method. If the planet is not found,
   * it throws an `HttpException` with a "Not Found" status code. Otherwise, it uses the
   * `planetsRepository` to remove the planet from the database.
   *
   * @param planetId (number) The ID of the planet to remove.
   * @throws HttpException Throws an exception if the planet is not found or an error occurs during removal.
   */
  async remove(planetId: number): Promise<Planet> {
    const planet: Planet = await this.findOne(planetId)
    return await this.planetsRepository.remove(planet)
  }

  /**
   * Fills related entities (residents and films) for a planet
   *
   * This private helper method is used to populate the related entities (residents and films)
   * for a planet object. It iterates through the `relatedEntities` array to identify related entity
   * properties. For each related entity property with data in the `newPlanetDto`, it uses a nested
   * `Promise.all` to:
   *   1. Map over each element in the related entity array from the DTO.
   *   2. For each element (URL), find the corresponding entity from the appropriate repository
   *      (based on the `key`) using `findOne` with a filter on the `url` property.
   *   3. The resolved entities are assigned back to the corresponding related entity property in the `newPlanet` object.
   *
   * @param newPlanet (Planet) The planet object to populate related entities for.
   * @param newPlanetDto (CreatePlanetDto | UpdatePlanetDto) The DTO containing data for the planet and its related entities.
   * @throws HttpException Throws an exception if an error occurs during retrieval of related entities.
   */
  private async fillRelatedEntities(
    planet: Planet,
    planetDto: CreatePlanetDto | UpdatePlanetDto,
  ): Promise<void> {
    let tableName: string
    let firstParameter: string
    try {
      for (const key of this.relatedEntities) {
        if (planetDto[key]) {
          const entities = await Promise.all(
            planetDto[key].map(async (url: string) => {
              const repository = this.getRepositoryByKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((obj: null) => obj !== null)

          // Use raw query to insert relations, ignoring duplicates
          if (validEntities.length > 0) {
            tableName = key === 'residents' ? `people_planets` : `${key}_planets`
            firstParameter = key === 'residents' ? `peopleId` : `${key}Id`

            const values = validEntities
              .map((entity: { id: number }) => `(${entity.id}, ${planet.id})`)
              .join(',')
            await this.planetsRepository.query(
              `INSERT IGNORE INTO ${tableName} (${firstParameter}, planetsId) VALUES ${values}`,
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
   * related entity types (e.g., 'films', 'starships', 'species', 'vehicles',
   * 'homeworld'). If the key does not match any of these, an error is thrown.
   *
   * @param key The key representing the type of related entity
   * @returns The corresponding TypeORM repository for the given key
   * @throws Error if no repository is found for the given key
   */
  private getRepositoryByKey(key: string): Repository<any> {
    switch (key) {
      case 'residents':
        return this.peopleRepository
      case 'films':
        return this.filmsRepository
      default:
        throw new Error(`No repository found for key: ${key}`)
    }
  }
}
