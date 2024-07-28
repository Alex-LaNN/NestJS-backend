import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { DataSource, Repository } from 'typeorm'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { People } from 'src/people/entities/people.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Species } from 'src/species/entities/species.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { dbName, localUrl, relatedEntitiesMap } from 'src/shared/utils'
import {
  extractIdFromUrl,
  getResponceOfException,
} from 'src/shared/common.functions'

/**
 * FilmsService: Service for managing film resources
 *
 * This service provides business logic for film-related operations, including
 * creating, retrieving, updating, and deleting films. It utilizes the
 * `filmsRepository` for database access and interacts with repositories for
 * related entities (characters, starships, planets, species, vehicles).
 */
@Injectable()
export class FilmsService {
  // Array of film-related entity names
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Starship)
    private readonly starshipsRepository: Repository<Starship>,
    @InjectRepository(Planet)
    private readonly planetsRepository: Repository<Planet>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly dataSource: DataSource,
  ) {
    this.relatedEntities = relatedEntitiesMap.films.relatedEntities
  }

  /**
   * Creates a new film resource
   *
   * This method creates a new film entity in the database using the provided
   * `CreateFilmDto` data. It first checks if a film with the same title already
   * exists. If not, it creates a new `Film` object, populates its properties
   * from the DTO, and then fills in the related entities (characters, starships,
   * planets, species, vehicles) using the `fillRelatedEntities` method. Finally,
   * it saves the new film entity to the database and returns it.
   *
   * @param createFilmDto The data for the new film (CreateFilmDto)
   * @returns The created Film entity or null if a film with the same title already exists
   * @throws HttpException on error
   */
  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    try {
      // Check if a film with the same title already exists
      const existingFilm = await this.filmsRepository.findOne({
        where: { title: createFilmDto.title },
      })
      // Return null if duplicate title found
      if (existingFilm) {
        console.error(`Сущность ${createFilmDto.title} уже существует!`)
        return null
      }

      // Create a new Film object
      const newFilm: Film = new Film()
      // Get the last inserted ID
      const lastIdResult = await this.filmsRepository.query(
        'SELECT MAX(id) as maxId FROM films',
      )
      console.log(`maxId:`, lastIdResult[0].maxId)
      newFilm.url = `${localUrl}films/${lastIdResult[0].maxId + 1}/`
      console.log(`url:`, newFilm.url)
      // Populate film properties from DTO
      for (const key in createFilmDto) {
        newFilm[key] = this.relatedEntities.includes(key)
          ? []
          : createFilmDto[key]
      }
      // Fill in related entities
      await this.fillRelatedEntities(newFilm, createFilmDto)
      console.log(`fs93: newFilm - `, newFilm)
      // Save the new film to the database
      return this.filmsRepository.save(newFilm)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Retrieves all film resources with pagination
   *
   * This method uses the `nestjs-typeorm-paginate` library to retrieve a paginated
   * list of film entities from the database. It takes `IPaginationOptions` as input
   * and returns a `Pagination<Film>` object containing film data and pagination
   * information.
   *
   * @param options Pagination options (IPaginationOptions)
   * @returns Pagination object containing film data and pagination information
   * @throws HttpException on error
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Film>> {
    try {
      return paginate<Film>(this.filmsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves a film resource by its ID
   *
   * This method retrieves a specific film entity from the database based on the
   * provided ID. It uses the `filmsRepository` to find the film with the given
   * ID and returns the film object if found.
   *
   * @param filmId The ID of the film to retrieve (number)
   * @returns The Film entity with the specified ID, or null if not found
   * @throws HttpException on error
   */
  async findOne(filmId: number): Promise<Film> {
    const film: Film = await this.filmsRepository.findOne({
      where: {
        id: filmId,
      },
    })
    // Return the film entity or 'null'
    return film
  }

  /**
   * Updates a film resource by its ID
   *
   * This method updates an existing film entity in the database using the provided
   * ID and `UpdateFilmDto` data. It first retrieves the film from the database
   * using `findOne`. Then, it updates the film's properties with the values from
   * the `UpdateFilmDto`, sets the `edited` timestamp, and fills in the related
   * entities (if updated). Finally, it saves the updated film entity to the
   * database and returns it.
   *
   * @param filmId The ID of the film to update (number)
   * @param updateFilmDto The data for updating the film (UpdateFilmDto)
   * @returns The updated Film entity, or null if not found
   * @throws HttpException on error
   */
  async update(filmId: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    try {
      const film: Film = await this.findOne(filmId)
      // Return null if not found
      if (!film) return null
      // Update film properties from DTO
      for (const key in updateFilmDto) {
        if (updateFilmDto.hasOwnProperty(key) && updateFilmDto[key]) {
          film[key] = updateFilmDto[key]
        }
      }
      // Update edited timestamp
      film.edited = new Date()
      // Fill in related entities
      await this.fillRelatedEntities(film, updateFilmDto)
      // Save the updated film
      return this.filmsRepository.save(film)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Deletes a film resource by its ID
   *
   * This method removes a film entity from the database based on the provided ID.
   * It first retrieves the film using `findOne`. Then, if the film exists, it
   * deletes the film entity from the database using `filmsRepository.remove`.
   *
   * @param filmId The ID of the film to delete (number)
   * @returns No return value, void on success
   * @throws HttpException on error
   */
  async remove(filmId: number): Promise<Film> {
    const film: Film = await this.findOne(filmId)
    return await this.filmsRepository.remove(film)
  }

  /**
   * Fills related entities for a new or updated film
   *
   * This method fills in the related entities (characters, starships, planets,
   * species, vehicles) for a new or updated film object. It iterates through
   * the `relatedEntities` array and checks if the corresponding property exists
   * in the `newFilmDto` data. If it does, it uses a `Promise.all` chain to
   * concurrently fetch the related entities from their respective repositories
   * based on the URLs provided in the DTO. The fetched entities are then assigned
   * to the corresponding property of the `newFilm` object.
   *
   * @param newFilm The film object to fill related entities for (Film)
   * @param newFilmDto The data containing related entity URLs (CreateFilmDto | UpdateFilmDto)
   * @returns No return value, void on success
   * @throws HttpException on error
   */
  private async fillRelatedEntities(
    newFilm: Film,
    newFilmDto: CreateFilmDto | UpdateFilmDto,
  ): Promise<void> {
    try {
      await Promise.all(
        this.relatedEntities.map(async (key: string) => {
          if (newFilmDto[key]) {
            newFilm[key] = await Promise.all(
              newFilmDto[key].map(async (elem: string) => {
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
   * related entity types (e.g., 'films', 'starships', 'species', 'vehicles',
   * 'homeworld'). If the key does not match any of these, an error is thrown.
   *
   * @param key The key representing the type of related entity
   * @returns The corresponding TypeORM repository for the given key
   * @throws Error if no repository is found for the given key
   */
  private getRepositoryByKey(key: string): Repository<any> {
    switch (key) {
      case 'characters':
        return this.peopleRepository
      case 'planets':
        return this.planetsRepository
      case 'starships':
        return this.starshipsRepository
      case 'vehicles':
        return this.vehiclesRepository
      case 'species':
        return this.speciesRepository
      default:
        throw new Error(`No repository found for key: ${key}`)
    }
  }
}
