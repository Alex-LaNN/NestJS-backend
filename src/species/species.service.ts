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
import { localUrl, relatedEntitiesMap } from 'src/shared/utils'

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
    @InjectRepository(People)
    @InjectRepository(Film)
    @InjectRepository(Planet)
    private readonly repositories: {
      residents: Repository<People>
      films: Repository<Film>
      homeworld: Repository<Planet>
    },
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
        throw new HttpException('Species already exists!', HttpStatus.FORBIDDEN)
      }

      // Create a new Species object
      const newSpecies: Species = new Species()
      // Populate Species properties from createSpeciesDto
      for (const key in createSpeciesDto) {
        newSpecies[key] = this.relatedEntities.includes(key)
          ? [] // Initialize empty array for related entities
          : createSpeciesDto[key]
      }
      // Populate related entities
      await this.fillRelatedEntities(newSpecies, createSpeciesDto)
      // Save the new Species entity to the database
      return this.speciesRepository.save(newSpecies)
    } catch (error) {
      throw getResponceOfException(error)
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
  async remove(speciesId: number) {
    try {
      const species: Species = await this.findOne(speciesId)
      await this.speciesRepository.remove(species)
    } catch (error) {
      throw getResponceOfException(error)
    }
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
    newSpeciesDto: CreateSpeciesDto | UpdateSpeciesDto,
  ): Promise<void> {
    await Promise.all(
      this.relatedEntities.map(async (key) => {
        if (key === 'homeworld' && newSpeciesDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${newSpeciesDto.homeworld}/`
          const planet: Planet = await this.repositories.homeworld.findOne({
            where: { url: urlToSearch },
          })
          species.homeworld = planet
        } else if (newSpeciesDto[key]) {
          species[key] = await Promise.all(
            newSpeciesDto[key].map(async (elem: string) => {
              const entity = await this.repositories[key].findOne({
                where: { url: elem },
              })
              return entity
            }),
          )
        }
      }),
    )
  }
}
