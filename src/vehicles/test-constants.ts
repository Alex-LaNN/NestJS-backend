import { Pagination } from 'nestjs-typeorm-paginate'
import { Vehicle } from './entities/vehicle.entity'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'

/**
 * A mock vehicle object representing a vehicle entity
 *
 * This mock object represents a Vehicle entity with a specific id and name.
 */
export const vehicle = { id: 1, name: 'Sand Crawler' } as Vehicle

/**
 * DTO object for creating a new vehicle
 *
 * This object is used as a Data Transfer Object (DTO) for creating a new vehicle.
 * It contains various properties such as name, model, cargo_capacity, etc.
 */
export const createVehicleDto: CreateVehicleDto = {
  name: 'Sand Crawler',
  cargo_capacity: '50000',
  consumables: '2 months',
  cost_in_credits: '150000',
  crew: '46',
  length: '36.8',
  manufacturer: 'Corellia Mining Corporation',
  max_atmosphering_speed: '30',
  model: 'Digger Crawler',
  passengers: '30',
  vehicle_class: 'wheeled',
  films: ['film1'],
  pilots: ['pilot1'],
}

/**
 * A mock new vehicle object representing a vehicle entity after creation
 *
 * This mock object represents a vehicle entity with additional fields like
 * created and edited timestamps, along with the fields from createVehicleDto.
 */
export const newVehicle = {
  id: 1,
  created: '2014-12-09T13:50:51.644Z',
  edited: '2014-12-20T21:17:56.891Z',
  ...createVehicleDto,
} as unknown as Vehicle

/**
 * DTO object for updating an existing vehicle
 *
 * This object is used as a Data Transfer Object (DTO) for updating an existing vehicle.
 * It contains only the fields that are allowed to be updated.
 */
export const updatedVehicleDto: UpdateVehicleDto = {
  name: 'Sand Crawler Updated',
}

/**
 * A mock existing vehicle object representing a vehicle entity before update
 *
 * This mock object represents a vehicle entity with the fields from CreateVehicleDto.
 */
export const existingVehicle = {
  id: 1,
  ...CreateVehicleDto,
} as unknown as Vehicle

/**
 * A mock updated vehicle object representing a vehicle entity after update
 *
 * This mock object represents a vehicle entity with the updated fields.
 */
export const updatedVehicle = {
  id: 1,
  ...UpdateVehicleDto,
} as unknown as Vehicle

/**
 * Mock paginated result for vehicle entities
 *
 * This mock object represents a paginated result for vehicle entities.
 * It contains an array of items (vehicle) and meta information about
 * the pagination such as itemCount, totalItems, itemsPerPage, totalPages,
 * and currentPage.
 */
export const paginatedResult: Pagination<Vehicle> = {
  items: [],
  meta: {
    itemCount: 0,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
}

/**
 * A mock people object representing a people entity
 *
 * This mock object represents a people entity with a specific URL.
 */
export const people = { url: 'people1' } as People

/**
 * A mock film object representing a film entity
 *
 * This mock object represents a film entity with a specific URL.
 */
export const film = { url: 'film1' } as Film
