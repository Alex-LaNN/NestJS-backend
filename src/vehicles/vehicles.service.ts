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
import {
  extractIdFromUrl,
  getResponceOfException,
} from 'src/shared/common.functions'

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
   * Create a new vehicle
   *
   * This method creates a new vehicle entity in the database. It checks for existing
   * vehicles with the same name, returns null if such a starship exists, and otherwise
   * creates a new `Vehicle` instance, populates its properties from the `CreateVehicleDto`,
   * fills related entities (`pilots`, `films`), and saves the new vehicle to the repository.
   *
   * @param createVehicleDto Data Transfer Object containing vehicle creation data.
   * @returns The newly created Vehicle entity.
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
      // Finding the last vehicle's ID
      const nextIdForNewVehicle: number = await this.getNextIdForNewVehicle()
      newVehicle.url = `${localUrl}vehicles/${nextIdForNewVehicle}/`
      // Populate Vehicle properties from CreateVehicleDto
      for (const key in createVehicleDto) {
        newVehicle[key] = this.relatedEntities.includes(key)
          ? []
          : createVehicleDto[key]
      }
      // Fill related entities (pilots, films)
      await this.fillRelatedEntities(newVehicle, createVehicleDto)
      // Save the new Vehicle to the repository
      return await this.vehicleRepository.save(newVehicle)
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
   * Fill related entities for a vehicle
   *
   * This private helper method fills the related entities (`pilots`, `films`) for a given
   * vehicle entity. It iterates over the `relatedEntities` array, checks if the corresponding
   * property in the `newVehicleDto` is not empty, and then fetches the related entities
   * (People or Films) from the respective repositories based on their URLs.
   *
   * @param entity The Vehicle entity to update related entities for.
   * @param newVehicleDto The CreateVehicleDto or UpdateVehicleDto containing related entity URLs.
   * @returns A Promise that resolves when all related entities have been filled.
   * @throws HttpException - Error if any related entity cannot be found or any other error occurs.
   */
  private async fillRelatedEntities(
    entity: Vehicle,
    newVehicleDto: CreateVehicleDto | UpdateVehicleDto,
  ): Promise<void> {
    try {
      // Parallel filling of related entities for each specified key
      await Promise.all(
        this.relatedEntities.map(async (key) => {
          if (newVehicleDto[key]) {
            // Fetch related entities and assign them to the 'entity' object
            entity[key] = await Promise.all(
              newVehicleDto[key].map(async (elem: string) => {
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
   *
   */
  private async getNextIdForNewVehicle() {
    const lastVehicle = await this.vehicleRepository.query(`
      SELECT url FROM vehicles ORDER BY id DESC LIMIT 1
      `)
    // Default ID if there are no vehicles in the database
    let nextId = 1

    if (lastVehicle.length > 0 && lastVehicle[0].url) {
      // Use the extractIdFromUrl function to get the last ID
      const lastId = (await extractIdFromUrl(lastVehicle[0].url)) as number
      nextId = lastId + 1 // Increment the ID for the new vehicle
    }
    return nextId
  }
}
