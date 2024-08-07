import { Pagination } from 'nestjs-typeorm-paginate'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { Film } from './entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'

/**
 * A mock film object representing a film entity
 *
 * This mock object represents a film entity with a specific id and title.
 */
export const film = { id: 1, title: 'A New Hope' } as Film

/**
 * DTO object for creating a new film
 *
 * This object is used as a Data Transfer Object (DTO) for creating a new film.
 * It contains various properties such as title, characters, episode_id, etc.
 */
export const createFilmDto: CreateFilmDto = {
  title: 'New Film for test',
  characters: ['people1'],
  episode_id: 1,
  opening_crawl: 'Text for test...',
  director: 'Text for test...',
  producer: 'Text for test...',
  release_date: undefined,
  species: ['species1'],
  starships: ['starship1'],
  vehicles: ['vehicle1'],
  planets: ['planet1'],
}

/**
 * A mock new film object representing a film entity after creation
 *
 * This mock object represents a film entity with additional fields like
 * created and edited timestamps, along with the fields from createFilmDto.
 */
export const newFilm = {
  id: 1,
  created: '2014-12-09T13:50:51.644Z',
  edited: '2014-12-20T21:17:56.891Z',
  ...createFilmDto,
} as unknown as Film

/**
 * DTO object for updating an existing film
 *
 * This object is used as a Data Transfer Object (DTO) for updating an existing film.
 * It contains only the fields that are allowed to be updated.
 */
export const updatedFilmDto: UpdateFilmDto = {
  title: 'A New Hope Updated',
}

/**
 * A mock existing film object representing a film entity before update
 *
 * This mock object represents a film entity with the fields from createFilmDto.
 */
export const existingFilm = { id: 1, ...createFilmDto } as unknown as Film

/**
 * A mock updated film object representing a film entity after update
 *
 * This mock object represents a film entity with the updated fields.
 */
export const updatedFilm = { id: 1, ...updatedFilmDto } as unknown as Film

/**
 * Mock paginated result for film entities
 *
 * This mock object represents a paginated result for film entities. It contains
 * an array of items (films) and meta information about the pagination such as
 * itemCount, totalItems, itemsPerPage, totalPages, and currentPage.
 */
export const paginatedResult: Pagination<Film> = {
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
