import { Test, TestingModule } from '@nestjs/testing'
import { StarshipsService } from './starships.service'
import { DataSource, Repository } from 'typeorm'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Starship } from './entities/starship.entity'
import {
  createStarshipDto,
  existingStarship,
  film,
  newStarship,
  paginatedResult,
  people,
  starship,
  updatedStarship,
  updatedStarshipDto,
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
 * Unit test suite for StarshipsService.
 * This test suite covers various scenarios for creating, finding, updating, deleting starship records,
 * and managing related entities in the StarshipsService.
 */
describe('StarshipsService', () => {
  let service: StarshipsService
  let starshipRepository: Repository<Starship>
  let filmRepository: Repository<Film>
  let peopleRepository: Repository<People>
  let dataSource: DataSource

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsService,
        {
          provide: getRepositoryToken(Starship),
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

    service = module.get<StarshipsService>(StarshipsService)
    starshipRepository = module.get<Repository<Starship>>(
      getRepositoryToken(Starship),
    )
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )
    dataSource = module.get<DataSource>(DataSource)

    // Mock implementation for paginate function
    jest
      .spyOn(starshipRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the repositories property in the service
      ((service as any).repositories = {
        pilots: peopleRepository,
        films: filmRepository,
      })
  })

  /**
   * Test to ensure the StarshisService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of StarshisService.
   */
  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(null)
    })
    /**
     * Test to verify that a new starship can be created successfully.
     */
    it('should create a new starship', async () => {
      //jest.spyOn(service, 'getNextIdForNewStarship').mockResolvedValue(1)
      jest.spyOn(starshipRepository, 'save').mockResolvedValue(newStarship)

      expect(await service.create(createStarshipDto)).toEqual(newStarship)
    })

    /**
     * Test to verify that creating a starship with an existing name returns null.
     */
    it('should return null if a starship with the same name already exists', async () => {
      jest
        .spyOn(starshipRepository, 'findOne')
        .mockResolvedValue(existingStarship)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createStarshipDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Starship '${createStarshipDto.name}' already exists!`,
      )

      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(starshipRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.create(createStarshipDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of StarshipsService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated starships.
     */
    it('should return paginated starships', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of StarshipsService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single starship by ID.
     */
    it('should return a single starship by ID', async () => {
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)

      expect(await service.findOne(1)).toEqual(starship)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(starshipRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of StarshipsService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
    })
    /**
     * Test to verify that a starship can be updated successfully.
     */
    it('should update a starship', async () => {
      jest.spyOn(starshipRepository, 'save').mockResolvedValue(updatedStarship)

      expect(await service.update(1, updatedStarshipDto)).toEqual(
        updatedStarship,
      )
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(starshipRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.update(1, updatedStarshipDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of StarshipsService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
    })
    /**
     * Test to verify that a starship can be removed successfully.
     */
    it('should remove a starship', async () => {
      jest.spyOn(starshipRepository, 'remove').mockResolvedValue(starship)

      expect(await service.remove(1)).toEqual(starship)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(starshipRepository, 'remove')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.remove(1)).rejects.toThrow('Internal server error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of StarshipsService.
   */
  describe('fillRelatedEntities', () => {
    const newStarship: Starship = new Starship()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)

      await service['fillRelatedEntities'](newStarship, createStarshipDto)

      expect(newStarship.pilots).toContain(people)
      expect(newStarship.films).toContain(film)
    })

    /**
     * Test to verify that errors in related entity lookups are handled properly.
     */
    it('should handle errors in related entity lookups', async () => {
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(
        service['fillRelatedEntities'](newStarship, createStarshipDto),
      ).rejects.toThrow('Internal server error')
    })
  })
})

// npm run test -- starships.service.spec.ts
