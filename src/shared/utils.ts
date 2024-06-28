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

/**
 * Получение конфигурации.
 */
const config = getConfig()
export const { host, port, limitCount, dbName } = config

/**
 * Перечисление HTTP-кодов состояния.
 */
enum HttpStatusCode {
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

/**
 * Отображение кодов ошибок HTTP на соответствующие объекты ошибок.
 */
export const errorMap: Record<HttpStatusCode, Error> = {
  404: new NotFoundException('Object is not found'),
  400: new BadRequestException('Invalid input data'),
  401: new UnauthorizedException('Unauthorized access'),
  403: new ForbiddenException('Access denied'),
}

/**
 * Перечисления для полов.
 */
export enum E_Gender {
  Male = 'Male',
  Female = 'Female',
  Hermaphrodite = 'hermaphrodite',
  Other = 'n/a',
}

/**
 * Перечисления для ролей пользователей.
 */
export enum Role {
  User = 'user',
  Admin = 'admin',
}

/**
 * URL для SWAPI и локального сервера.
 */
export const swapiUrl: string = 'https://swapi.dev/api/'
export const localUrl: string = `http://${host}:${port}/`

/**
 * Интерфейс, описывающий объект с ссылками на доступные ресурсы SWAPI
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
 * Интерфейс, описывающий объект ответа об ошибке
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
 * Общий тип для сущностей
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
 * Объект списка сущностей, содержащий имена и соответствующие классы сущностей.
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
 * Получение объекта списка сущностей для заполнения БД.
 */
export const { images, ...entityClassesForFill } = entityClasses

/**
 * Определение общего типа, который объединяет все классы сущностей.
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
 * Динамическое определение типа репозитория в зависимости от конкретной сущности.
 */
export type RepositoryForEntity<T> = T extends keyof typeof entityClasses // возможно ли тип 'T' присвоить одному из ключей объекта 'entities'
  ? Repository<(typeof entityClasses)[T]>
  : never // тип 'T' не соответствует ни одному ключу 'entities' => такой тип недопустим!

/**
 * Интерфейс для описания информации о сущности.
 */
export interface EntityInfo {
  repository: Repository<Entity>
  relatedEntities: string[]
}

/**
 * 
 */
export interface DbConfig {
  dbHost: string
  dbPort: number
  dbUser: string
  dbPass: string
  dbName: string
}

/**
 * Интерфейс для одиночного ответа
 */
export interface SingleEntityResponse<T extends BaseEntity> {
  data: T;
}

/**
 * Интерфейс для списка сущностей
 */
export interface SwapiResponse<T extends BaseEntity> {
  count: number
  results: T[]
  next: string | null
  previous: string | null
}

/**
 * Универсальный интерфейс базовой сущности.
 */
export interface BaseEntity {
  id: number
  url: string
  homeworld?: number | string
  homeworldId?: number
  residents?:number[]
  residentsId?: number[]
  [key: string]: any
}

/**
 * Интерфейс базовой сущности с учетом связанных сущностей
 */
export interface ExtendedBaseEntity extends BaseEntity, RelationsEntity {}
  
/**
 * Динамическое создание типа для связанных сущностей
 */
type RelationsEntity = {
  [K in typeof listOfRelations[number]]?: number | string | number[] | string[];
};

/**
 * Массив всех допустимых названий связанных сущностей.
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
 * Универсальный тип ответа
 */
export type ApiResponse<T extends BaseEntity> =
  | SingleEntityResponse<T>
  | SwapiResponse<T>;

/**
 * Отображение связанных сущностей для всех типов сущностей, описанных в 'entityClasses'
 */
export type RelatedEntitiesMap = {
  [key in keyof typeof entityClasses]: {
    relatedEntities: string[]
  }
}

/**
 * Отображение связанных сущностей для каждого ресурса SWAPI
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
 * Объект, описывающий связь между сущностями и их отношениями.
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
 * 
 */
export interface Payload {
  sub: string
  role: string
}

/**
 * 
 */
export interface ErrorResponce {
  error: Error
  user: User | null
  isActionCompleted: boolean
}
