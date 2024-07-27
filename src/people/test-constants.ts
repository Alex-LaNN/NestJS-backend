import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate"
import { CreatePeopleDto } from "./dto/create-people.dto"
import { UpdatePeopleDto } from "./dto/update-people.dto"
import { People } from "./entities/people.entity"

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
 * Data Transfer Object (DTO) for updating an existing person
 *
 * This constant represents the data needed to update an existing "People" entity.
 * It includes fields that can be updated, such as the name.
 */
export const updatePeopleDto: UpdatePeopleDto = {
  name: 'Luke Skywalker Updated',
}
/**
 * Updated person object
 *
 * This constant represents an updated "People" entity object, combining an existing
 * ID with updated fields from the `updatePeopleDto`. It can be used for testing or
 * mocking purposes.
 */
export const updatedPerson = { id: 1, ...updatePeopleDto } as unknown as People
/**
 * Pagination options for retrieving a list of people
 *
 * This constant defines the pagination options, specifying the page number and the
 * number of items per page. It is used to paginate the list of "People" entities.
 */
export const paginationOptions: IPaginationOptions = { page: 1, limit: 10 }
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