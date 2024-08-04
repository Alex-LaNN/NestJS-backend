import { People } from './entities/people.entity'
import { CreatePeopleDto } from './dto/create-people.dto'
import { UpdatePeopleDto } from './dto/update-people.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { Injectable } from '@nestjs/common'
import { Species } from 'src/species/entities/species.entity'
import { Film } from 'src/films/entities/film.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { localUrl, relatedEntitiesMap } from 'src/shared/constants'

/**
 * PeopleService: Provides CRUD operations for "people" resources
 *
 * This service handles the creation, retrieval, update, and deletion of "people" resources
 * within the application. It interacts with the `People` repository and injects repositories
 * for related entities (films, starships, planets, species, vehicles, and images) to manage
 * their associations.
 */
@Injectable()
export class PeopleService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(Starship)
    private readonly starshipsRepository: Repository<Starship>,
    @InjectRepository(Planet)
    private readonly homeworldRepository: Repository<Planet>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
  ) {
    this.relatedEntities = relatedEntitiesMap.people.relatedEntities
  }

  /**
   * Creates a new "people" resource
   *
   * This method creates a new "people" resource by accepting a `CreatePeopleDto` object.
   * It checks for existing characters with the same name before creating the new entry.
   * It then iterates through the DTO properties, populating the corresponding fields in the
   * `People` entity and handling related entities (films, starships, planets, species,
   * vehicles) by calling the `fillRelatedEntities` method. Finally, it saves the new
   * "people" resource to the database.
   *
   * @param createPeopleDto A DTO object containing data for the new "people" resource
   * @returns A Promise resolving to the newly created `People` entity object,
   *          or `null` if a character with the same name already exists.
   */
  async create(createPeopleDto: CreatePeopleDto): Promise<People> {
    // Check for existing character with the same name
    const existsPeople: People = await this.peopleRepository.findOne({
      where: { name: createPeopleDto.name },
    })
    if (existsPeople) {
      console.error(`People '${createPeopleDto.name}' already exists!`)
      return null
    }

    // Create a new People entity
    let newPeople = new People()
    // Get the last inserted ID
    const lastIdResult = await this.peopleRepository.query(
      'SELECT MAX(id) as maxId FROM people',
    )
    const nextId: number =
      lastIdResult.length > 0 ? lastIdResult[0].maxId + 1 : 1
    newPeople.url = `${localUrl}people/${nextId}/`

    // Populate people properties from DTO, excluding related entities
    for (const key in createPeopleDto) {
      if (key !== 'url' && !this.relatedEntities.includes(key)) {
        newPeople[key] = createPeopleDto[key]
      }
    }

    // Save the new people to the database without related entities
    const savedPeople = await this.peopleRepository.save(newPeople)

    // Update URL if necessary
    if (savedPeople.id !== nextId) {
      console.warn(
        `Predicted ID (${nextId}) doesn't match actual ID (${savedPeople.id}). Updating URL...`,
      )
      await this.peopleRepository.query(
        'UPDATE people SET url = ? WHERE id = ?',
        [`${localUrl}vehicles/${savedPeople.id}/`, savedPeople.id],
      )
      savedPeople.url = `${localUrl}people/${savedPeople.id}/`
    }

    // Fill in related entities
    await this.fillRelatedEntities(savedPeople, createPeopleDto)

    // Fetch the updated people to reflect all changes
    const updatedPeople: People = await this.peopleRepository.findOne({
      where: { id: savedPeople.id },
      relations: this.relatedEntities,
    })

    return updatedPeople
  }

  /**
   * Retrieves all "people" resources (paginated)
   *
   * This method retrieves a paginated list of "people" resources using the `nestjs-typeorm-paginate`
   * library. It accepts pagination options (`IPaginationOptions`) to control the page number and
   * number of items per page.
   *
   * @param options Pagination options object specifying page number and limit
   * @returns A Promise resolving to a `Pagination<People>` object containing the paginated list
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<People>> {
    return paginate<People>(this.peopleRepository, options)
  }

  /**
   * Retrieves a single "people" resource by ID
   *
   * This method retrieves a single "people" resource by its ID specified in the `peopleId` parameter.
   *
   * @param peopleId The ID of the "people" resource to retrieve
   * @returns A Promise resolving to the `People` entity object representing the resource,
   *          or `null` if not found
   */
  async findOne(peopleId: number): Promise<People> {
    return await this.peopleRepository.findOne({
      where: {
        id: peopleId,
      },
    })
  }

  /**
   * Updates a "people" resource by ID
   *
   * This method updates an existing "people" resource by its ID. It fetches the resource first,
   * then iterates through the `updatePeopleDto` object, updating the corresponding fields in the
   * `People` entity. It also updates the `edited` field with the current date and calls the
   * `fillRelatedEntities` method to handle updates for related entities (films, starships, planets,
   * species, vehicles). Finally, it saves the updated resource to the database.
   *
   * @param peopleId The ID of the "people" resource to update
   * @param updatePeopleDto A DTO object containing the updated data for the "people" resource
   * @returns A Promise resolving to the updated `People` entity object
   */
  async update(
    peopleId: number,
    updatePeopleDto: UpdatePeopleDto,
  ): Promise<People> {
    const person = await this.findOne(peopleId)
    // Prepare an object with updated data
    for (const key in updatePeopleDto) {
      if (updatePeopleDto.hasOwnProperty(key) && updatePeopleDto[key]) {
        person[key] = updatePeopleDto[key]
      }
    }
    // Update 'edited' field with current date
    person.edited = new Date()
    // Handle updates for related entities (films, starships, planets, species, vehicles)
    await this.fillRelatedEntities(person, updatePeopleDto)
    return this.peopleRepository.save(person)
  }

  /**
   * Deletes a "people" resource by ID
   *
   * This method deletes a "people" resource by its ID. It first fetches the resource
   * and then removes it from the database using the `peopleRepository.remove` method.
   *
   * @param peopleId The ID of the "people" resource to delete
   * @returns A Promise resolving to `void` upon successful deletion
   */
  async remove(peopleId: number): Promise<People> {
    const person = await this.findOne(peopleId)
    return await this.peopleRepository.remove(person)
  }

  /**
   * Fills related entities for a "people" resource
   *
   * This private helper method handles updates for related entities (films, starships, planets,
   * species, vehicles) associated with a "people" resource.
   * It iterates through the `relatedEntities` array and checks for updates in the
   * corresponding fields of the `updatePeopleDto` object. For the "homeworld" entity,
   * it constructs a URL based on `localUrl` and searches for the planet by URL.
   * For other related entities (films, starships, vehicles), it uses a Promise.all to fetch
   * all related entities based on their URLs provided in the `updatePeopleDto`.
   * Finally, it updates the corresponding fields in the `newPeople` object.
   *
   * @param newPeople The "People" entity object to update related entities for
   * @param newPersonDto A DTO object containing update data (including related entities)
   * @returns A Promise resolving to `void`
   */
  private async fillRelatedEntities(
    people: People,
    peopleDto: CreatePeopleDto | UpdatePeopleDto,
  ): Promise<void> {
    let tableName: string
    let secondParameter: string
    try {
      for (const key of this.relatedEntities) {
        if (key === 'homeworld' && peopleDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${peopleDto.homeworld}/`
          const planet: Planet = await this.homeworldRepository.findOne({
            where: { url: urlToSearch },
          })
          await this.peopleRepository.query(
            `UPDATE people SET homeworldId = ? WHERE id = ?`,
            [planet.id, people.id],
          )
        } else if (peopleDto[key]) {
          const entities = await Promise.all(
            peopleDto[key].map(async (url: string) => {
              const repository = this.getRepositoryForKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((e: null) => e !== null)

          // Use raw query to insert relations, ignoring duplicates
          if (validEntities.length > 0) {
            tableName = `people_${key}`
            secondParameter = `${key}Id`

            const values = validEntities
              .map((entity: { id: number }) => `(${people.id}, ${entity.id})`)
              .join(',')
            await this.peopleRepository.query(
              `INSERT IGNORE INTO ${tableName} (peopleId, ${secondParameter}) VALUES ${values}`,
            )
          }
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  // private async fillRelatedEntities(
  //   newPeople: People,
  //   newPersonDto: CreatePeopleDto | UpdatePeopleDto,
  // ): Promise<void> {
  //   await Promise.all(
  //     this.relatedEntities.map(async (key) => {
  //       if (key === 'homeworld' && newPersonDto.homeworld) {
  //         const urlToSearch: string = `${localUrl}planets/${newPersonDto.homeworld}/`
  //         const planet: Planet = await this.homeworldRepository.findOne({
  //           where: { url: urlToSearch },
  //         })
  //         newPeople.homeworld = planet
  //       } else if (newPersonDto[key]) {
  //         newPeople[key] = await Promise.all(
  //           newPersonDto[key].map(async (elem: string) => {
  //             const repository = this.getRepositoryForKey(key)
  //             const entity = await repository.findOne({
  //               where: { url: elem },
  //             })
  //             return entity
  //           }),
  //         )
  //       }
  //     }),
  //   )
  // }

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
  private getRepositoryForKey(key: string): Repository<any> {
    switch (key) {
      case 'films':
        return this.filmsRepository
      case 'starships':
        return this.starshipsRepository
      case 'species':
        return this.speciesRepository
      case 'vehicles':
        return this.vehiclesRepository
      case 'homeworld':
        return this.homeworldRepository
      default:
        throw new Error(`No repository found for key: ${key}`)
    }
  }
}
