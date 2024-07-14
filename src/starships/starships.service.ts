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
import { relatedEntitiesMap } from 'src/shared/utils'

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
    @InjectRepository(People)
    @InjectRepository(Film)
    private readonly repositories: {
      pilots: Repository<People>
      films: Repository<Film>
    },
  ) {
    this.relatedEntities = relatedEntitiesMap.starships.relatedEntities
  }

  /**
   * Creates a new Starship record
   *
   * This method creates a new Starship entity in the database based on the provided data
   * in the `createStarshipDto` parameter. It checks for existing Starship with the same
   * name, throws an error if such a starship exists, and otherwise creates a new Starship
   * object, populates its properties, and saves it to the database.
   *
   * @param createStarshipDto - Data transfer object containing Starship creation data
   * @returns Promise<Starship> - Promise resolving to the created Starship entity
   * @throws HttpException - Error with code HttpStatus.FORBIDDEN if Starship with the same name exists
   */
  async create(createStarshipDto: CreateStarshipDto) {
    try {
      const existsStarship: Starship = await this.starshipsRepository.findOne({
        where: { name: createStarshipDto.name },
      })
      if (existsStarship) {
        throw new HttpException(
          'Starship already exists!',
          HttpStatus.FORBIDDEN,
        )
      }

      const newStarship: Starship = new Starship()
      // Iterate through the DTO fields and populate the 'newStarship' object
      for (const key in createStarshipDto) {
        newStarship[key] = this.relatedEntities.includes(key)
          ? []
          : createStarshipDto[key]
      }
      // Filling in related entities.
      await this.fillRelatedEntities(newStarship, createStarshipDto)
      return this.starshipsRepository.save(newStarship)
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
  async update(starshipId: number, updateStarshipDto: UpdateStarshipDto) {
    try {
      const starship: Starship = await this.findOne(starshipId)
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
   * if the deletion is successful, or throws an `HttpException` with code
   * HttpStatus.NOT_FOUND if the record is not found, or re-throws any other error.
   *
   * @param starshipId - ID of the Starship entity to delete (number)
   * @returns Promise<void> - Promise resolving to `void` if deletion is successful
   * @throws HttpException - Error with code HttpStatus.NOT_FOUND if the record is not found
   */
  async remove(starshipId: number) {
    try {
      const starship: Starship = await this.findOne(starshipId)
      await this.starshipsRepository.remove(starship)
    } catch (error) {
      throw getResponceOfException(error)
    }
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
                return await this.repositories[key].findOne({
                  where: { url: elem },
                })
              }),
            )
          }
        }),
      )
    } catch (error) {
      throw getResponceOfException(error)
    }
  }
}
