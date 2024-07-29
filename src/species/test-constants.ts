import { Pagination } from 'nestjs-typeorm-paginate'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { Species } from './entities/species.entity'

/**
 * A mock film object representing a species entity
 *
 * This mock object represents a species entity with a specific id and name.
 */
export const species: Species = { id: 1, name: 'Test Species' } as Species

/**
 * DTO object for creating a new species
 *
 * This object is used as a Data Transfer Object (DTO) for creating a new species.
 * It contains various properties such as name, classification, homeworld, etc.
 */
export const createSpeciesDto: CreateSpeciesDto = {
  name: 'New Species',
  classification: 'Mammal',
  designation: 'Sentient',
  average_height: '2.1',
  skin_colors: 'green',
  hair_colors: 'black, brown',
  eye_colors: 'blue, green, yellow, brown, golden, red',
  average_lifespan: '400',
  homeworld: 1,
  language: 'Test Language',
  people: ['people1'],
  films: ['film1'],
}

/**
 * A mock new species object representing a species entity after creation
 *
 * This mock object represents a species entity with additional fields like
 * created and edited timestamps, along with the fields from createFilmDto.
 */
export const newSpecies = {
  id: 1,
  created: new Date(),
  edited: new Date(),
  ...createSpeciesDto,
} as unknown as Species

/**
 * DTO object for updating an existing species
 *
 * This object is used as a Data Transfer Object (DTO) for updating an existing species.
 * It contains only the fields that are allowed to be updated.
 */
export const updatedSpeciesDto: UpdateSpeciesDto = {
  name: 'Test Species Updated',
}

/**
 * A mock existing species object representing a film entity before update
 *
 * This mock object represents a species entity with the fields from createSpeciesDto.
 */
export const existingSpecies = { id: 1, ...createSpeciesDto } as unknown as Species

/**
 * A mock updated species object representing a species entity after update
 *
 * This mock object represents a species entity with the updated fields.
 */
export const updatedSpecies: Species = {
  id: 1,
  ...updatedSpeciesDto,
} as unknown as Species

/**
 * Mock paginated result for species entities
 *
 * This mock object represents a paginated result for species entities. It contains
 * an array of items (species) and meta information about the pagination such as
 * itemCount, totalItems, itemsPerPage, totalPages, and currentPage.
 */
export const paginatedResult: Pagination<Species> = {
  items: [],
  meta: {
    itemCount: 0,
    totalItems: 0,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
}
