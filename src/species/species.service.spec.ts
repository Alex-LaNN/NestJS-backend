import { Test, TestingModule } from '@nestjs/testing'
import { SpeciesService } from './species.service'
import { DataSource, Repository } from 'typeorm'
import { Species } from './entities/species.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { paginate } from 'nestjs-typeorm-paginate'
import {
  createSpeciesDto,
  existingSpecies,
  film,
  newSpecies,
  paginatedResult,
  people,
  planet,
  species,
  updatedSpecies,
  updatedSpeciesDto,
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
 * Unit test suite for SpeciesService.
 * This test suite covers various scenarios for creating, finding, updating, deleting species records,
 * and managing related entities in the SpeciesService.
 */
describe('SpeciesService', () => {
  let service: SpeciesService
  let speciesRepository: Repository<Species>
  let peopleRepository: Repository<People>
  let filmRepository: Repository<Film>
  let planetRepository: Repository<Planet>

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: getRepositoryToken(Species),
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
          provide: getRepositoryToken(Planet),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ url: 'planet1' } as Planet),
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

    service = module.get<SpeciesService>(SpeciesService)
    speciesRepository = module.get<Repository<Species>>(
      getRepositoryToken(Species),
    )
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
    planetRepository = module.get<Repository<Planet>>(
      getRepositoryToken(Planet),
    )

    // Mock implementation for paginate function
    jest
      .spyOn(speciesRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the relatedEntities property in the service
      ((service as any).repositories = {
        people: peopleRepository,
        homeworld: planetRepository,
        films: filmRepository,
      })
  })

  /**
   * Test to ensure the SpeciesService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of SpeciesService.
   */
  describe('create', () => {
    /**
     * Test to verify that a new species can be created successfully.
     */
    it('should create a new species', async () => {
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(speciesRepository, 'save').mockResolvedValue(newSpecies)
      jest.spyOn(speciesRepository, 'query').mockResolvedValue([{ maxId: 0 }])
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValueOnce(newSpecies)

      // Setting up mocks for related entities
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)

      const result = await service.create(createSpeciesDto)
      expect(result).toEqual(newSpecies)
    })

    /**
     * Test to verify that creating a species with an existing name throws an exception.
     */
    it('should return null if a species with the same name already exists', async () => {
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(null)
      jest
        .spyOn(speciesRepository, 'findOne')
        .mockResolvedValue(existingSpecies)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createSpeciesDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Species '${createSpeciesDto.name}' already exists!`,
      )
      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(speciesRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.create(createSpeciesDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of SpeciesService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated species.
     */
    it('should return paginated species', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of SpeciesService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single species by ID.
     */
    it('should return a single species by ID', async () => {
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)

      expect(await service.findOne(1)).toEqual(species)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(speciesRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of SpeciesService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
    })
    /**
     * Test to verify that a species can be updated successfully.
     */
    it('should update a species', async () => {
      jest.spyOn(speciesRepository, 'save').mockResolvedValue(updatedSpecies)

      expect(await service.update(1, updatedSpeciesDto)).toEqual(updatedSpecies)
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(speciesRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.update(1, updatedSpeciesDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of SpeciesService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
    })
    /**
     * Test to verify that a species can be removed successfully.
     */
    it('should remove a species', async () => {
      jest.spyOn(speciesRepository, 'remove').mockResolvedValue(species)

      expect(await service.remove(1)).toEqual(species)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(speciesRepository, 'remove')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.remove(1)).rejects.toThrow('Internal server error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of SpeciesService.
   */
  describe('fillRelatedEntities', () => {
    const newSpecies: Species = new Species()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)

      await service['fillRelatedEntities'](newSpecies, createSpeciesDto)

      expect(newSpecies.homeworld).toEqual(planet)
      expect(newSpecies.people).toContain(people)
      expect(newSpecies.films).toContain(film)
    })

    /**
     * Test to verify that errors in related entity retrieval are handled properly.
     */
    it('should handle errors when filling related entities', async () => {
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValue(new Error('People not found'))

      await expect(
        service['fillRelatedEntities'](newSpecies, createSpeciesDto),
      ).rejects.toThrow('People not found')
    })
  })
})

// npm run test -- species.service.spec.ts
