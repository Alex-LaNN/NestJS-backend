import { Test, TestingModule } from '@nestjs/testing'
import { FilmsService } from './films.service'
import { DataSource, Repository } from 'typeorm'
import { Film } from './entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { paginate } from 'nestjs-typeorm-paginate'
import {
  createFilmDto,
  existingFilm,
  film,
  newFilm,
  paginatedResult,
  people,
  planet,
  species,
  starship,
  updatedFilm,
  updatedFilmDto,
  vehicle,
} from './test-constants'
import { paginationOptions } from 'src/shared/constants'

/**
 * Mocking the `nestjs-typeorm-paginate` module
 *
 * This line uses Jest to mock the `nestjs-typeorm-paginate` module.
 * By mocking this module, we can control its behavior during tests,
 * allowing us to isolate the functionality being tested and avoid
 * dependencies on the actual implementation of the module.
 * This is useful for unit testing, where we want to focus on testing
 * the logic of our code without being affected by external modules or services.
 */
jest.mock('nestjs-typeorm-paginate')

/**
 * Unit test suite for FilmsService.
 * This test suite covers various scenarios for creating, finding, updating, deleting film records,
 * and managing related entities in the FilmsService.
 */
describe('FilmsService', () => {
  let service: FilmsService
  let filmRepository: Repository<Film>
  let peopleRepository: Repository<People>
  let planetRepository: Repository<Planet>
  let speciesRepository: Repository<Species>
  let starshipRepository: Repository<Starship>
  let vehicleRepository: Repository<Vehicle>

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            query: jest.fn().mockResolvedValue([{ maxId: 0 }]),
          },
        },
        {
          provide: getRepositoryToken(People),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ url: 'people1' } as People),
          },
        },
        {
          provide: getRepositoryToken(Planet),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ url: 'planet1' } as Planet),
          },
        },
        {
          provide: getRepositoryToken(Species),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ url: 'species1' } as Species),
          },
        },
        {
          provide: getRepositoryToken(Starship),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ url: 'starship1' } as Starship),
          },
        },
        {
          provide: getRepositoryToken(Vehicle),
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ url: 'vehicle1' } as Vehicle),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile()

    //service = module.get<FilmsService>(FilmsService)
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )
    planetRepository = module.get<Repository<Planet>>(
      getRepositoryToken(Planet),
    )
    speciesRepository = module.get<Repository<Species>>(
      getRepositoryToken(Species),
    )
    starshipRepository = module.get<Repository<Starship>>(
      getRepositoryToken(Starship),
    )
    vehicleRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle),
    )

    // Mock implementation for paginate function
    jest
      .spyOn(filmRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the repositories property in the service
      ((service as any).repositories = {
        characters: peopleRepository,
        planets: planetRepository,
        starships: starshipRepository,
        species: speciesRepository,
        vehicles: vehicleRepository,
      })
  })

  /**
   * Test to ensure the FilmsService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of FilmsService.
   */
  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(null)
    })
    /**
     * Test to verify that a new film can be created successfully.
     */
    it('should create a new film', async () => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(filmRepository, 'save').mockResolvedValue(newFilm)
      jest.spyOn(filmRepository, 'query').mockResolvedValue([{ maxId: 0 }])
      jest.spyOn(filmRepository, 'findOne').mockResolvedValueOnce(newFilm)

      // Setting up mocks for related entities
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)

      const result = await service.create(createFilmDto)
      expect(result).toEqual(newFilm)
    })

    /**
     * Test to verify that creating a film with an existing name returns null.
     */
    it('should return null if a film with the same name already exists', async () => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(existingFilm)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createFilmDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Film '${createFilmDto.title}' already exists!`,
      )

      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(filmRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.create(createFilmDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of FilmsService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated films.
     */
    it('should return paginated films', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of FilmsService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single film by ID.
     */
    it('should return a single film by ID', async () => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)

      expect(await service.findOne(1)).toEqual(film)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(filmRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of FilmsService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
    })
    /**
     * Test to verify that a film can be updated successfully.
     */
    it('should update a film', async () => {
      jest.spyOn(filmRepository, 'save').mockResolvedValue(updatedFilm)

      expect(await service.update(1, updatedFilmDto)).toEqual(updatedFilm)
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(filmRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.update(1, updatedFilmDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of FilmsService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
    })
    /**
     * Test to verify that a film can be removed successfully.
     */
    it('should remove a film', async () => {
      jest.spyOn(filmRepository, 'remove').mockResolvedValue(film)

      expect(await service.remove(1)).toEqual(film)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(filmRepository, 'remove')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.remove(1)).rejects.toThrow('Internal server error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of FilmsService.
   */
  describe('fillRelatedEntities', () => {
    const newFilm: Film = new Film()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)

      await service['fillRelatedEntities'](newFilm, createFilmDto)

      expect(newFilm.characters).toBeDefined()
      expect(newFilm.characters).toContainEqual(people)
      expect(newFilm.planets).toContainEqual(planet)
      expect(newFilm.species).toContainEqual(species)
      expect(newFilm.starships).toContainEqual(starship)
      expect(newFilm.vehicles).toContainEqual(vehicle)
    })

    /**
     * Test to verify that errors in related entity lookups are handled properly.
     */
    it('should handle errors in related entity lookups', async () => {
      jest
        .spyOn(planetRepository, 'findOne')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(
        service['fillRelatedEntities'](newFilm, createFilmDto),
      ).rejects.toThrow('Internal server error')
    })
  })
})

// npm run test -- films.service.spec.ts
