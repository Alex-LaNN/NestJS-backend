import { Pagination } from 'nestjs-typeorm-paginate'
import { CreatePeopleDto } from './dto/create-people.dto'
import { UpdatePeopleDto } from './dto/update-people.dto'
import { People } from './entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'

/**
 * A sample person object
 *
 * This constant represents a sample "People" entity object, initialized with
 * an ID and a name. It can be used for testing or mocking purposes.
 */
export const person = { id: 1, name: 'Luke Skywalker' } as People

/**
 * Data Transfer Object (DTO) for creating a new person
 *
 * This constant represents the data needed to create a new "People" entity.
 * It includes various fields such as name, height, mass, and related entities
 * like films, species, vehicles, and starships.
 */
export const createPeopleDto: CreatePeopleDto = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 1,
  films: ['film1'],
  species: ['species1'],
  vehicles: ['vehicle1'],
  starships: ['starship1'],
}

/**
 * A mock new person object representing a "People" entity after creation
 *
 * This mock object represents a person entity with additional fields like
 * created and edited timestamps, along with the fields from createPeopleDto.
 */
export const newPeople = {
  id: 1,
  created: '2014-12-09T13:50:51.644Z',
  edited: '2014-12-20T21:17:56.891Z',
  ...createPeopleDto,
} as unknown as People

/**
 * Data Transfer Object (DTO) for updating an existing person
 *
 * This constant represents the data needed to update an existing "People" entity.
 * It includes fields that can be updated, such as the name.
 */
export const updatePeopleDto: UpdatePeopleDto = {
  name: 'Luke Skywalker Updated',
}

/**
 * A mock existing person object representing a film entity before update
 *
 * This mock object represents a person entity with the fields from createPeopleDto.
 */
export const existingPerson = { id: 1, ...createPeopleDto } as unknown as People

/**
 * Updated person object
 *
 * This constant represents an updated "People" entity object, combining an existing
 * ID with updated fields from the `updatePeopleDto`. It can be used for testing or
 * mocking purposes.
 */
export const updatedPerson = { id: 1, ...updatePeopleDto } as unknown as People

/**
 * Paginated result for people
 *
 * This constant represents the result of a paginated query for "People" entities.
 * It includes an array of items and metadata about the pagination, such as item count,
 * total items, items per page, total pages, and current page.
 */
export const paginatedResult: Pagination<People> = {
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
 * A mock film object representing a film entity
 *
 * This mock object represents a film entity with a specific URL.
 */
export const film = { url: 'film1' } as Film

/**
 * A mock planet object representing a planet entity
 *
 * This mock object represents a planet entity with a specific URL.
 */
export const planet = { url: 'planet1' } as Planet

/**
 * A mock species object representing a species entity
 *
 * This mock object represents a species entity with a specific URL.
 */
export const species = { url: 'species1' } as Species

/**
 * A mock starship object representing a starship entity
 *
 * This mock object represents a starship entity with a specific URL.
 */
export const starship = { url: 'starship1' } as Starship

/**
 * A mock vehicle object representing a vehicle entity
 *
 * This mock object represents a vehicle entity with a specific URL.
 */
export const vehicle = { url: 'vehicle1' } as Vehicle
