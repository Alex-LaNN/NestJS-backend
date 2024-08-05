import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
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
 * VehiclesService
 *
 * This service provides methods for creating, reading, updating, and deleting (CRUD)
 * operations on vehicle data in the Star Wars universe. It interacts with the
 * `VehicleRepository` and related entity repositories to manage data persistence.
 */
@Injectable()
export class VehiclesService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    // Inject repositories for related entities (pilots, films)
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
  ) {
    this.relatedEntities = relatedEntitiesMap.vehicles.relatedEntities
  }

  /**
   * Creates a new Vehicle entity and populates its related entities.
   *
   * This method checks if a vehicle with the same name already exists. If not,
   * it creates a new Vehicle entity, sets its properties from the provided DTO,
   * and saves it to the database. It then populates related entities and
   * updates the vehicle's URL if necessary.
   *
   * @param createVehicleDto - The DTO containing data for creating the vehicle.
   * @returns A promise that resolves with the created and fully populated Vehicle entity,
   * or null if a vehicle with the same name already exists.
   * @throws An error if the operation fails.
   */
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      // Check for existing vehicle with the same name
      const existsVehicle: Vehicle = await this.vehicleRepository.findOne({
        where: { name: createVehicleDto.name },
      })
      if (existsVehicle) {
        console.error(`Vehicle '${createVehicleDto.name}' already exists!`)
        return null
      }

      // Create a new Vehicle instance
      const newVehicle: Vehicle = new Vehicle()
      // Get the last inserted ID
      const lastIdResult = await this.vehicleRepository.query(
        'SELECT MAX(id) as maxId FROM vehicles',
      )
      const nextId: number =
        lastIdResult.length > 0 ? lastIdResult[0].maxId + 1 : 1
      newVehicle.url = `${localUrl}vehicles/${nextId}/`

      // Populate vehicle properties from DTO, excluding related entities
      for (const key in createVehicleDto) {
        if (key !== 'url' && !this.relatedEntities.includes(key)) {
          newVehicle[key] = createVehicleDto[key]
        }
      }

      // Save the new vehicle to the database without related entities
      const savedVehicle = await this.vehicleRepository.save(newVehicle)

      // Update URL if necessary
      if (savedVehicle.id !== nextId) {
        console.warn(
          `Predicted ID (${nextId}) doesn't match actual ID (${savedVehicle.id}). Updating URL...`,
        )
        await this.vehicleRepository.query(
          'UPDATE vehicles SET url = ? WHERE id = ?',
          [`${localUrl}vehicles/${savedVehicle.id}/`, savedVehicle.id],
        )
        savedVehicle.url = `${localUrl}vehicles/${savedVehicle.id}/`
      }

      // Fill in related entities
      await this.fillRelatedEntities(savedVehicle, createVehicleDto)

      // Fetch the updated vehicle to reflect all changes
      const updatedVehicle: Vehicle = await this.vehicleRepository.findOne({
        where: { id: savedVehicle.id },
        relations: this.relatedEntities,
      })

      return updatedVehicle
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Get all vehicles (paginated)
   *
   * This method retrieves a paginated list of all vehicles from the database.
   * It uses the `paginate` function from `nestjs-typeorm-paginate` to handle
   * pagination options and returns a `Pagination<Vehicle>` object.
   *
   * @param options Pagination options (page, limit, etc.)
   * @returns A Pagination<Vehicle> object containing vehicle data and pagination information.
   * @throws HttpException if an error occurs during pagination.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Vehicle>> {
    try {
      // Execute query to the repository with pagination options
      return paginate<Vehicle>(this.vehicleRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Retrieves a Vehicle entity by its ID
   *
   * This method retrieves a single Vehicle entity from the database based on the
   * provided `vehicleId` parameter. It uses the `findOne` method of the
   * `vehiclesRepository` to fetch the Vehicle record with the corresponding ID.
   * It returns a `Promise` that resolves to the `Vehicle` entity if found,
   * or `null` if no record is found.
   *
   * @param vehicleId - ID of the Vehicle entity (number)
   * @returns Promise<Vehicle> - Promise resolving to the Vehicle entity or `null` if not found
   */
  async findOne(vehicleId: number): Promise<Vehicle> {
    // Find the Vehicle by ID
    const vehicle: Vehicle = await this.vehicleRepository.findOne({
      where: {
        id: vehicleId,
      },
    })
    // Return the Vehicle entity or 'null'
    return vehicle
  }

  /**
   * Update a vehicle
   *
   * This method updates an existing vehicle entity in the database. It retrieves
   * the vehicle by ID using the `findOne` method, then updates its properties based
   * on the data provided in the `updateVehicleDto`. It also sets the `edited` field
   * to the current date and time, fills related entities (`pilots`, `films`), and
   * saves the updated vehicle to the repository.
   *
   * @param vehicleId The ID of the vehicle to update.
   * @param updateVehicleDto Data Transfer Object containing updated vehicle data.
   * @returns The updated Vehicle entity.
   * @throws HttpException if the vehicle with the given ID is not found or an error occurs during update.
   */
  async update(
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    try {
      // Get the Vehicle by ID
      const vehicle: Vehicle = await this.findOne(vehicleId)
      // Return null if not found
      if (!vehicle) return null
      // Update Vehicle properties from UpdateVehicleDto
      for (const key in updateVehicleDto) {
        if (updateVehicleDto.hasOwnProperty(key) && updateVehicleDto[key]) {
          vehicle[key] = updateVehicleDto[key]
        }
      }
      // Set the 'edited' field to the current date and time
      vehicle.edited = new Date()
      // Update related entities (pilots, films)
      await this.fillRelatedEntities(vehicle, updateVehicleDto)
      // Save the updated Vehicle to the repository
      return await this.vehicleRepository.save(vehicle)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Delete a vehicle
   *
   * This method deletes a vehicle entity from the database by its ID. It retrieves
   * the vehicle using the `findOne` method, and then calls the `remove` method of
   * the `vehicleRepository` to delete the vehicle from the database.
   *
   * @param vehicleId The ID of the vehicle to delete.
   * @returns A Promise that resolves to nothing (void) upon successful deletion.
   */
  async remove(vehicleId: number): Promise<Vehicle> {
    // Get the Vehicle by ID
    const vehicle: Vehicle = await this.findOne(vehicleId)
    // Delete the Vehicle from the repository
    return await this.vehicleRepository.remove(vehicle)
  }

  /**
   * Populates and inserts related entities for the provided Vehicle entity.
   *
   * This method iterates over related entities, finds the corresponding entities in the database,
   * filters out null values, and uses a raw query to insert the relationships into the relevant table,
   * ignoring duplicates.
   *
   * @param vehicle - The Vehicle entity to populate related entities for.
   * @param vehicleDto - The DTO containing data for creating or updating the vehicle.
   * @returns A promise that resolves when the related entities have been populated and inserted.
   * @throws An error if the operation fails.
   */
  private async fillRelatedEntities(
    vehicle: Vehicle,
    vehicleDto: CreateVehicleDto | UpdateVehicleDto,
  ): Promise<void> {
    let tableName: string
    let firstParameter: string
    try {
      for (const key of this.relatedEntities) {
        if (vehicleDto[key]) {
          const entities = await Promise.all(
            vehicleDto[key].map(async (url: string) => {
              const repository = this.getRepositoryByKey(key)
              const entity = await repository.findOne({ where: { url } })
              return entity
            }),
          )

          // Filter out any null values (entities that weren't found)
          const validEntities = entities.filter((obj: null) => obj !== null)

          // Use raw query to insert relations, ignoring duplicates
          if (validEntities.length > 0) {
            tableName = key === 'pilots' ? 'people_vehicles' : `${key}_vehicles`
            firstParameter = key === 'pilots' ? 'peopleId' : `${key}Id`

            const values = validEntities
              .map((entity: { id: number }) => `(${entity.id}, ${vehicle.id})`)
              .join(',')
            await this.vehicleRepository.query(
              `INSERT IGNORE INTO ${tableName} (${firstParameter}, vehiclesId) VALUES ${values}`,
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
