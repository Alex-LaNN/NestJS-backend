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
   * Creates a new people entity and populates related entities.
   *
   * This method handles the creation of a new people entity, including checking for duplicates, populating properties
   * from the provided DTO, and filling in related entities. It also handles updating the URL if the predicted ID
   * does not match the actual ID.
   *
   * @param createPeopleDto - The DTO containing data for creating the people entity.
   * @returns A promise that resolves to the newly created and updated people entity.
   * @throws An error if the operation fails.
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
    const newPeople = new People()
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
        // Check if the name is being updated
        if (updatePeopleDto.name) {
          // Search for an existing person with the new name
          const existingPerson = await this.peopleRepository.findOne({
            where: {
              name: updatePeopleDto.name,
            },
          })

          // If a person with this name exists and it's not the same person we're updating
          if (existingPerson && existingPerson.id !== person.id) {
            console.error(`People '${updatePeopleDto.name}' already exists!`)
            return null
          }
        }
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
   * Populates related entities for a given people entity.
   *
   * This method handles the population of related entities for a given people entity based on the provided DTO.
   * It updates the homeworld if specified and handles other related entities by inserting relations into the database.
   *
   * @param people - The People entity to populate related entities for.
   * @param peopleDto - The DTO containing data for creating or updating the people entity.
   * @returns A promise that resolves when related entities are populated.
   * @throws An error if the operation fails.
   */
  private async fillRelatedEntities(
    people: People,
    peopleDto: CreatePeopleDto | UpdatePeopleDto,
  ): Promise<void> {
    let tableName: string
    let secondParameter: string
    try {
      for (const key of this.relatedEntities) {
        // Handle homeworld relationship
        if (key === 'homeworld' && peopleDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${peopleDto.homeworld}/`
          const planet: Planet = await this.homeworldRepository.findOne({
            where: { url: urlToSearch },
          })
          people[key] = planet
          await this.peopleRepository.query(
            `UPDATE people SET homeworldId = ? WHERE id = ?`,
            [planet.id, people.id],
          )
        } else if (peopleDto[key]) {
          // Handle other related entities
          const entities = await Promise.all(
            peopleDto[key].map(async (url: string) => {
              const repository = this.getRepositoryForKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((e: null) => e !== null)

          // Filling in the people property
          people[key] = validEntities

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
