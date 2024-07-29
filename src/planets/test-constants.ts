import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate'
import { CreatePlanetDto } from './dto/create-planet.dto'
import { UpdatePlanetDto } from './dto/update-planet.dto'
import { Planet } from './entities/planet.entity'

/**
 * A mock planet object representing a planet entity
 *
 * This mock object represents a planet entity with a specific id and name.
 */
export const planet = { id: 1, name: 'Tatooine' } as Planet

/**
 * DTO object for creating a new planet
 *
 * This object is used as a Data Transfer Object (DTO) for creating a new planet.
 * It contains various properties such as name, climate, diameter, etc.
 */
export const createPlanetDto: CreatePlanetDto = {
  name: 'New Planet for test',
  climate: 'arid',
  diameter: '10465',
  gravity: '1 standard',
  orbital_period: '304',
  population: '200000',
  rotation_period: '23',
  surface_water: '1',
  terrain: 'desert',
  residents: ['people1'],
  films: ['film1'],
}

/**
 * A mock new planet object representing a planet entity after creation
 *
 * This mock object represents a planet entity with additional fields like
 * created and edited timestamps, along with the fields from createPlanetDto.
 */
export const newPlanet = {
  id: 1,
  created: '2014-12-09T13:50:51.644Z',
  edited: '2014-12-20T21:17:56.891Z',
  ...createPlanetDto,
} as unknown as Planet

/**
 * DTO object for updating an existing planet
 *
 * This object is used as a Data Transfer Object (DTO) for updating an existing planet.
 * It contains only the fields that are allowed to be updated.
 */
export const updatedPlanetDto: UpdatePlanetDto = {
  name: 'Tatooine Updated',
}

/**
 * A mock existing planet object representing a planet entity before update
 *
 * This mock object represents a planet entity with the fields from createPlanetDto.
 */
export const existingPlanet = { id: 1, ...createPlanetDto } as unknown as Planet

/**
 * A mock updated planet object representing a planet entity after update
 *
 * This mock object represents a planet entity with the updated fields.
 */
export const updatedPlanet = { id: 1, ...updatedPlanetDto } as unknown as Planet

/**
 * Mock paginated result for planet entities
 *
 * This mock object represents a paginated result for planet entities. It contains
 * an array of items (planets) and meta information about the pagination such as
 * itemCount, totalItems, itemsPerPage, totalPages, and currentPage.
 */
export const paginatedResult: Pagination<Planet> = {
  items: [],
  meta: {
    itemCount: 0,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
}
