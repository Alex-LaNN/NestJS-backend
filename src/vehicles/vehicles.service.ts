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
import { relatedEntitiesMap } from 'src/shared/utils'

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
    // Injections for repositories of related entities
    @InjectRepository(People)
    @InjectRepository(Film)
    private readonly repositories: {
      pilots: Repository<People>
      films: Repository<Film>
    },
  ) {
    this.relatedEntities = relatedEntitiesMap.vehicles.relatedEntities
  }

  /**
   * Create a new vehicle
   *
   * This method creates a new vehicle entity in the database. It checks for existing
   * vehicles with the same name, creates a new `Vehicle` instance, populates its
   * properties from the `CreateVehicleDto`, fills related entities (`pilots`, `films`),
   * and saves the new vehicle to the repository.
   *
   * @param createVehicleDto Data Transfer Object containing vehicle creation data.
   * @returns The newly created Vehicle entity.
   * @throws HttpException if a vehicle with the same name already exists.
   */
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      // Check for existing vehicle with the same name
      const existsVehicle: Vehicle = await this.vehicleRepository.findOne({
        where: { name: createVehicleDto.name },
      })
      if (existsVehicle) {
        throw new HttpException('Vehicle already exists!', HttpStatus.FORBIDDEN)
      }

      // Create a new Vehicle instance
      const newVehicle: Vehicle = new Vehicle()
      // Populate Vehicle properties from CreateVehicleDto
      for (const key in createVehicleDto) {
        newVehicle[key] = this.relatedEntities.includes(key)
          ? []
          : createVehicleDto[key]
      }
      // Fill related entities (pilots, films)
      await this.fillRelatedEntities(newVehicle, createVehicleDto)
      // Save the new Vehicle to the repository
      return this.vehicleRepository.save(newVehicle)
    } catch (error) {
      // Обработка ошибки с преобразованием в стандартный формат ответа.
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
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
   * Find a vehicle by ID
   *
   * This method retrieves a single vehicle from the database by its ID.
   * It uses the `findOne` method of the `vehicleRepository` and throws an
   * `HttpException` if the vehicle is not found.
   *
   * @param vehicleId The ID of the vehicle to retrieve.
   * @returns The Vehicle entity with the matching ID, or undefined if not found.
   * @throws HttpException if the vehicle with the given ID is not found.
   */
  async findOne(vehicleId: number) {
    try {
      // Find the Vehicle by ID
      const vehicle: Vehicle = await this.vehicleRepository.findOne({
        where: {
          id: vehicleId,
        },
      })
      return vehicle
    } catch (error) {
      // Throw an exception if the object is not found
      throw new HttpException(
        `Vehicle with ID ${vehicleId} not found!`,
        HttpStatus.NOT_FOUND,
      )
    }
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
  async update(vehicleId: number, updateVehicleDto: UpdateVehicleDto) {
    try {
      // Get the Vehicle by ID
      const vehicle: Vehicle = await this.findOne(vehicleId)
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
   * @throws HttpException if the vehicle with the given ID is not found or an error occurs during deletion.
   */
  async remove(vehicleId: number): Promise<void> {
    try {
      // Get the Vehicle by ID
      const vehicle: Vehicle = await this.findOne(vehicleId)
      // Delete the Vehicle from the repository
      await this.vehicleRepository.remove(vehicle)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
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
   * @throws HttpException if an error occurs while fetching related entities.
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
                return await this.repositories[key].findOne({
                  where: { url: elem },
                })
              }),
            )
          }
        }),
      )
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
