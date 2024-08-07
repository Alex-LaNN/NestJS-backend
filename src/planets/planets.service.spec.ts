import { Test, TestingModule } from '@nestjs/testing'
import { PlanetsService } from './planets.service'
import { DataSource, Repository } from 'typeorm'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from './entities/planet.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import {
  createPlanetDto,
  existingPlanet,
  film,
  newPlanet,
  paginatedResult,
  people,
  planet,
  updatedPlanet,
  updatedPlanetDto,
} from './test-constants'
import { paginate } from 'nestjs-typeorm-paginate'
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
 * Unit test suite for PlanetsService.
 * This test suite covers various scenarios for creating, finding, updating, deleting planet records,
 * and managing related entities in the PlanetsService.
 */
describe('PlanetsService', () => {
  let service: PlanetsService
  let planetRepository: Repository<Planet>
  let peopleRepository: Repository<People>
  let filmRepository: Repository<Film>

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: getRepositoryToken(Planet),
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
          provide: getRepositoryToken(Film),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ url: 'film1' } as Film),
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

    service = module.get<PlanetsService>(PlanetsService)
    planetRepository = module.get<Repository<Planet>>(
      getRepositoryToken(Planet),
    )
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )

    // Mock implementation for paginate function
    jest
      .spyOn(planetRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the repositories property in the service
      ((service as any).repositories = {
        residents: peopleRepository,
        films: filmRepository,
      })
  })

  /**
   * Test to ensure the PlanetsService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of PlanetsService.
   */
  describe('create', () => {
    /**
     * Test to verify that a new planet can be created successfully.
     */
    it('should create a new planet', async () => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(planetRepository, 'save').mockResolvedValue(newPlanet)
      jest.spyOn(planetRepository, 'query').mockResolvedValue([{ maxId: 0 }])
      jest.spyOn(planetRepository, 'findOne').mockResolvedValueOnce(newPlanet)

      // Setting up mocks for related entities
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)

      const result = await service.create(createPlanetDto)
      expect(result).toEqual(newPlanet)
    })

    /**
     * Test to verify that creating a planet with an existing name returns null.
     */
    it('should return null if a planet with the same name already exists', async () => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(existingPlanet)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createPlanetDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Planet '${createPlanetDto.name}' already exists!`,
      )

      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(planetRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.create(createPlanetDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of PlanetsService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated planets.
     */
    it('should return paginated planets', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of PlanetsService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single planet by ID.
     */
    it('should return a single planet by ID', async () => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)

      expect(await service.findOne(1)).toEqual(planet)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(planetRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of PlanetsService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
    })
    /**
     * Test to verify that a planet can be updated successfully.
     */
    it('should update a planet', async () => {
      jest.spyOn(planetRepository, 'save').mockResolvedValue(updatedPlanet)

      expect(await service.update(1, updatedPlanetDto)).toEqual(updatedPlanet)
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(planetRepository, 'save')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.update(1, updatedPlanetDto)).rejects.toThrow(
        'Repository error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of PlanetsService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
    })
    /**
     * Test to verify that a planet can be removed successfully.
     */
    it('should remove a planet', async () => {
      jest.spyOn(planetRepository, 'remove').mockResolvedValue(planet)

      expect(await service.remove(1)).toEqual(planet)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(planetRepository, 'remove')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.remove(1)).rejects.toThrow('Internal server error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of PlanetsService.
   */
  describe('fillRelatedEntities', () => {
    const newPanet: Planet = new Planet()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)

      await service['fillRelatedEntities'](newPanet, createPlanetDto)

      expect(newPanet.residents).toContain(people)
      expect(newPanet.films).toContain(film)
    })

    /**
     * Test to verify that errors in related entity lookups are handled properly.
     */
    it('should handle errors in related entity lookups', async () => {
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(
        service['fillRelatedEntities'](newPanet, createPlanetDto),
      ).rejects.toThrow('Internal server error')
    })
  })
})

// npm run test -- planets.service.spec.ts
