import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Image } from 'src/images/entities/image.entity'
import getConfig from '../configurrations/dotenv.config'
import { Repository } from 'typeorm'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from 'src/user/entities/user.entity'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'

/**
 * Retrieves configuration from the environment variables file (.env)
 *
 * This function utilizes the `getConfig` function from the `configurrations/dotenv.config` file to
 * load the configuration values from the `.env` file. It extracts the `host`, `port`, `limitCount`, and `dbName`
 * properties and stores them in separate variables for easy access.
 */
const config = getConfig()
export const { host, port, limitCount, dbName } = config

/**
 * Pagination options for querying entities
 *
 * This object represents pagination options such as the current page and the limit
 * of items per page, which are used when querying entities with pagination.
 */
export const paginationOptions: IPaginationOptions = { page: 1, limit: 10 }

/**
 * Enum for time unit conversions in seconds.
 * Provides constants for the number of seconds in common time units.
 */
export enum TimeUnits {
  SECONDS_IN_A_MINUTE = 60,
  SECONDS_IN_AN_HOUR = 3600,
  SECONDS_IN_A_DAY = 86400,
  SECONDS_IN_A_YEAR = 31536000, // Number of seconds in a year (365 days)
}

/**
 * Enum for HTTP status codes
 *
 * This enum defines the common HTTP status codes that might be used in the application.
 * It includes `NOT_FOUND`, `BAD_REQUEST`, `UNAUTHORIZED`, and `FORBIDDEN` codes.
 */
enum HttpStatusCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

/**
 * Mapping HTTP status codes to corresponding error objects
 *
 * This object maps the defined HTTP status codes (`HttpStatusCode`) to the corresponding error objects
 * that should be thrown in case of those errors. It uses a record type to associate each status code
 * with the appropriate error object.
 */
export const errorMap: Record<HttpStatusCode, Error> = {
  400: new BadRequestException('Invalid input data'),
  401: new UnauthorizedException('Unauthorized access'),
  403: new ForbiddenException('Access denied'),
  404: new NotFoundException('Object is not found'),
}

/**
 * Enum for genders
 *
 * This enum defines the possible gender values for characters in the Star Wars universe.
 * It includes `Male`, `Female`, `Hermaphrodite`, and `Other`.
 */
export enum E_Gender {
  Male = 'Male',
  Female = 'Female',
  Hermaphrodite = 'hermaphrodite',
  Other = 'n/a',
}

/**
 * Enum for user roles
 *
 * This enum defines the possible roles for users in the application.
 * It includes `User` and `Admin` roles.
 */
export enum UserRoles {
  User = 'user',
  Admin = 'admin',
}

/**
 * Constants for SWAPI and local server URLs
 *
 * These constants define the URLs for SWAPI (the Star Wars API) and the local server.
 * `swapiUrl` is used for fetching data from SWAPI, while `localUrl` is used for constructing local URLs.
 */
export const swapiUrl_1: string = 'https://swapi.dev/api/'
export const swapiUrl_2: string = 'https://sw-api.starnavi.io/'
export const localUrl: string = `http://${host}:${port}/`

/**
 * Interface for SWAPI endpoints
 *
 * This interface defines the structure of the SWAPI endpoints object.
 * It contains properties for each type of SWAPI resource (e.g., `people`, `planets`, `films`).
 */
export type SwapiEndpoints = {
  people: string
  planets: string
  films: string
  species: string
  vehicles: string
  starships: string
}

/**
 * Interface for error response object
 *
 * This interface defines the structure of the error response object used in the `custom-exception.filter`.
 * It includes properties for `statusCode`, `timestamp`, `path`, `method`, `errorName`, and `message`.
 */
export type ErrorResponse = {
  statusCode: number
  timestamp: string
  path: string
  method: string
  errorName?: string
  message: string
}

/**
 * Interface for error response structure
 *
 * This interface defines the structure of the error response object that is returned by the application.
 * It contains the following properties:
 *
 * - `error`: An `Error` object representing the encountered error.
 * - `user`: A `User` object representing the currently logged-in user, or `null` if there is no logged-in user.
 * - `isActionCompleted`: A boolean flag indicating whether the action that caused the error was completed despite the error.
 */
export interface ErrorResponce {
  error: Error
  user: User | null
  isActionCompleted: boolean
}

/**
 * General type for entities
 *
 * This type alias defines a union type `Entity` that represents all the different types of entities in the application.
 * It includes the following entity types:
 *
 * - `Film`: Represents a film entity.
 * - `People`: Represents a people entity.
 * - `Image`: Represents an image entity.
 * - `Planet`: Represents a planet entity.
 * - `Species`: Represents a species entity.
 * - `Starship`: Represents a starship entity.
 * - `Vehicle`: Represents a vehicle entity.
 */
export type Entity =
  | Film
  | People
  | Image
  | Planet
  | Species
  | Starship
  | Vehicle

/**
 * Object containing entity names and their corresponding entity classes
 *
 * This object defines a mapping between entity names (keys) and their corresponding entity classes (values).
 * It is used to dynamically access entity classes based on their names.
 */
export const entityClasses = {
  starships: Starship,
  vehicles: Vehicle,
  planets: Planet,
  species: Species,
  films: Film,
  people: People,
  images: Image,
}

/**
 * Extracting the 'images' entity from the 'entityClasses' object
 *
 * This code snippet destructures the `images` property from the `entityClasses` object and assigns it to a separate
 * variable named `images`. It also creates a new object named `entityClassesForFill` by using the spread operator (`...`)
 * to include all the remaining properties (except `images`) from the `entityClasses` object. This effectively separates the
 * `images` entity for specific use cases.
 */
export const { images, ...entityClassesForFill } = entityClasses

/**
 * Defining a type alias for entity classes
 *
 * This type alias `EntityClass` defines a union type that represents all the entity classes in the application.
 * It is similar to the `Entity` type alias, but it specifically refers to the entity classes themselves, rather than
 * instances of those entities.
 */
export type EntityClass =
  | typeof People
  | typeof Film
  | typeof Starship
  | typeof Vehicle
  | typeof Species
  | typeof Planet
  | typeof Image

/**
 * Dynamic repository type based on entity type
 *
 * This type alias `RepositoryForEntity` defines a conditional type that dynamically determines the type of a repository
 * based on the provided entity type. It utilizes a conditional type guard to check if the provided `T` type can be
 * assigned to one of the keys (`entityClasses`) of the `entityClasses` object.
 *
 * - If the condition is true (`T` is a valid entity type), it returns the type of the repository for that entity.
 *   For example, if `T` is `People`, it returns `Repository<People>`.
 *
 * - If the condition is false (`T` is not a valid entity type), it returns the type `never`. This indicates that
 *   an invalid entity type was provided.
 */
export type RepositoryForEntity<T> = T extends keyof typeof entityClasses // Check if 'T' can be a key of 'entityClasses'
  ? Repository<(typeof entityClasses)[T]>
  : never // type 'T' does not match any 'entities' key => this type is not valid!

/**
 * Interface for entity information
 *
 * This interface `EntityInfo` defines the structure for representing information about an entity.
 * It includes the following properties:
 *
 * - `repository`: A `Repository` object for the corresponding entity type.
 * - `relatedEntities`: An array of strings representing the related entity names for the given entity.
 */
export interface EntityInfo {
  repository: Repository<Entity>
  relatedEntities: string[]
}

/**
 * Interface for database configuration
 *
 * This interface `DbConfig` defines the structure for configuring the database connection.
 * It includes the following properties:
 *
 * - `dbHost`: The hostname of the database server.
 * - `dbPort`: The port number of the database server.
 * - `dbUser`: The username for accessing the database.
 * - `dbPass`: The password for accessing the database.
 * - `dbName`: The name of the database to connect to.
 */
export interface DbConfig {
  dbHost: string
  dbPort: number
  dbUser: string
  dbPass: string
  dbName: string
}

/**
 * SingleEntityResponse Interface: Represents a response containing a single entity.
 *
 * This interface is used to structure the response that contains a single entity
 * of a generic type extending BaseEntity. It includes a single property, `data`,
 * which holds the entity.
 *
 * @template T - The type of the entity, extending BaseEntity.
 */
export interface SingleEntityResponse<T extends BaseEntity> {
  /**
   * The entity data.
   */
  data: T
}

/**
 * Interface for a list of entities response (SWAPI response)
 *
 * This interface `SwapiResponse` defines the structure for a response from the SWAPI API containing a list of entities.
 * It includes the following properties:
 *
 * - `count`: The total number of entities available.
 * - `results`: An array of entity objects.
 * - `next`: The URL for the next page of results (if available).
 * - `previous`: The URL for the previous page of results (if available).
 */
export interface SwapiResponse<T extends BaseEntity> {
  count: number
  results: T[]
  next: string | null
  previous: string | null
}

/**
 * Interface for a basic entity
 *
 * This interface `BaseEntity` defines the structure for a basic entity in the application.
 * It includes the following properties that are common to all entities:
 *
 * - `id`: The unique identifier for the entity.
 * - `url`: The URL for the entity's page on SWAPI.
 * - `homeworld`: The URL or ID of the entity's homeworld (if applicable).
 * - `homeworldId`: The numeric ID of the entity's homeworld (if applicable).
 * - `residents`: An array of URLs or IDs of the entity's residents (if applicable).
 * - `residentsId`: An array of numeric IDs of the entity's residents (if applicable).
 * - `[key: string]: any`: A catch-all property to allow for additional entity-specific properties.
 */
export interface BaseEntity {
  id: number
  url: string
  homeworld?: number | string
  homeworldId?: number
  residents?: number[]
  residentsId?: number[]
  [key: string]: any // Catch-all property for additional entity-specific properties
}

/**
 * Interface for a basic entity with related entities
 *
 * This interface `ExtendedBaseEntity` extends the `BaseEntity` interface and adds a `relatedEntities` property.
 * The `relatedEntities` property is an array of strings representing the names of the related entities for the given entity.
 * This information is used for data fetching and relationship management.
 */
export interface ExtendedBaseEntity extends BaseEntity, RelationsEntity {}

/**
 * Dynamic type for related entities
 *
 * This type alias `RelationsEntity` defines a conditional type that dynamically creates a union type for related entities.
 * It utilizes a mapped type to iterate over the `listOfRelations` array and generate a corresponding property for each relation name.
 * The property type is a union of `number`, `string`, `number[]`, and `string[]`, allowing for either IDs or URLs of related entities.
 */
type RelationsEntity = {
  [K in (typeof listOfRelations)[number]]?:  // Iterate over 'listOfRelations' array
    | number
    | string
    | number[]
    | string[] // Union type for each relation property
}

/**
 * Array of all valid related entity names
 *
 * This constant `listOfRelations` is an array containing the names of all valid related entities.
 * It is used in the `RelationsEntity` type alias to define the possible relation property names.
 */
export const listOfRelations: string[] = [
  'people',
  'characters',
  'pilots',
  'residents',
  'films',
  'species',
  'starships',
  'vehicles',
  'homeworld',
  'planets',
  'images',
]

/**
 * Universal API response type
 *
 * This type alias `ApiResponse` defines a union type representing the possible API response structures.
 * It includes two possible response types:
 *
 * - `SingleEntityResponse<T>`: A response containing a single entity object of type `T`.
 * - `SwapiResponse<T>`: A response containing a list of entity objects of type `T` (from SWAPI).
 */
export type ApiResponse<T extends BaseEntity> =
  | SingleEntityResponse<T>
  | SwapiResponse<T>

/**
 * Type alias for related entities map
 *
 * This type alias `RelatedEntitiesMap` defines a mapped type that represents a mapping between SWAPI resource names
 * and their corresponding related entities. It utilizes a mapped type to iterate over the `entityClasses` object and
 * generate a corresponding property for each resource name. The property value is an object containing an array of
 * related entity names for that resource.
 */
export type RelatedEntitiesMap = {
  [key in keyof typeof entityClasses]: {
    relatedEntities: string[]
  }
}

/**
 * Mapping of related entities for each SWAPI resource
 *
 * This constant `relatedEntitiesMap` is an object that defines the mapping between SWAPI resource names and their
 * corresponding related entities. It is used to determine the relationships between entities and fetch related data.
 */
export const relatedEntitiesMap: RelatedEntitiesMap = {
  films: {
    relatedEntities: [
      'characters',
      'planets',
      'starships',
      'vehicles',
      'species',
      'images',
    ],
  },
  starships: {
    relatedEntities: ['films', 'pilots', 'images'],
  },
  people: {
    relatedEntities: [
      'homeworld',
      'films',
      'starships',
      'species',
      'vehicles',
      'images',
    ],
  },
  vehicles: {
    relatedEntities: ['pilots', 'films', 'images'],
  },
  species: {
    relatedEntities: ['people', 'films', 'homeworld', 'images'],
  },
  planets: {
    relatedEntities: ['residents', 'films', 'images'],
  },
  images: {
    relatedEntities: [
      'people',
      'films',
      'starships',
      'planets',
      'species',
      'vehicles',
    ],
  },
}

/**
 * Object describing entity relationships and their related entities
 *
 * This object `relationMappings` defines a mapping between entity types and their corresponding related entities.
 * It is used to determine the relationships between entities and fetch related data.
 */
export const relationMappings = {
  people: ['people', 'characters', 'pilots', 'residents'],
  films: ['films'],
  planets: ['planets', 'homeworld'],
  starships: ['starships'],
  vehicles: ['vehicles'],
  species: ['species'],
  images: ['images'],
}

/**
 * Interface for JWT payload structure
 *
 * This interface `Payload` defines the structure of the payload for a JWT token.
 * The payload contains the following properties:
 *
 * - `sub`: The subject of the token, which is typically the user's unique identifier.
 * - `role`: The user's role in the application, such as `user` or `admin`.
 */
export interface Payload {
  sub: string
  role: string
}
