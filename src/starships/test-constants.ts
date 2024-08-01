import { Pagination } from 'nestjs-typeorm-paginate'
import { CreateStarshipDto } from './dto/create-starship.dto'
import { UpdateStarshipDto } from './dto/update-starship.dto'
import { Starship } from './entities/starship.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'

/**
 * A mock starship object representing a starship entity
 *
 * This mock object represents a starship entity with a specific id and name.
 */
export const starship = { id: 1, name: 'Death Star' } as Starship

/**
 * DTO object for creating a new starship
 *
 * This object is used as a Data Transfer Object (DTO) for creating a new starship.
 * It contains various properties such as name, model, MGLT, etc.
 */
export const createStarshipDto: CreateStarshipDto = {
  name: 'Death Star',
  model: 'DS-1 Orbital Battle Station',
  MGLT: '10 MGLT',
  cargo_capacity: '1000000000000',
  consumables: '3 years',
  cost_in_credits: '1000000000000',
  crew: '342953',
  hyperdrive_rating: '4.0',
  length: '120000',
  manufacturer:
    'Imperial Department of Military Research, Sienar Fleet Systems',
  max_atmosphering_speed: 'n/a',
  passengers: '843342',
  starship_class: 'Deep Space Mobile Battlestation',
  films: ['film1'],
  pilots: ['pilot1'],
}

/**
 * A mock new starship object representing a starship entity after creation
 *
 * This mock object represents a starship entity with additional fields like
 * created and edited timestamps, along with the fields from createStarshipDto.
 */
export const newStarship = {
  id: 1,
  created: '2014-12-09T13:50:51.644Z',
  edited: '2014-12-20T21:17:56.891Z',
  ...createStarshipDto,
} as unknown as Starship

/**
 * DTO object for updating an existing starship
 *
 * This object is used as a Data Transfer Object (DTO) for updating an existing starship.
 * It contains only the fields that are allowed to be updated.
 */
export const updatedStarshipDto: UpdateStarshipDto = {
  name: 'Death Star Updated',
}

/**
 * A mock existing starship object representing a starship entity before update
 *
 * This mock object represents a starship entity with the fields from CreateStarshipDto.
 */
export const existingStarship = {
  id: 1,
  ...CreateStarshipDto,
} as unknown as Starship

/**
 * A mock updated starship object representing a starship entity after update
 *
 * This mock object represents a starship entity with the updated fields.
 */
export const updatedStarship = {
  id: 1,
  ...UpdateStarshipDto,
} as unknown as Starship

/**
 * Mock paginated result for starship entities
 *
 * This mock object represents a paginated result for starship entities. It contains
 * an array of items (starship) and meta information about the pagination such as
 * itemCount, totalItems, itemsPerPage, totalPages, and currentPage.
 */
export const paginatedResult: Pagination<Starship> = {
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
