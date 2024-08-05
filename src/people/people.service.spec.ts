import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PeopleService } from './people.service'
import { People } from './entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { paginate } from 'nestjs-typeorm-paginate'
import {
  createPeopleDto,
  existingPerson,
  film,
  newPeople,
  paginatedResult,
  person,
  planet,
  species,
  starship,
  updatedPerson,
  updatePeopleDto,
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
 * Unit test suite for PeopleService.
 * This test suite covers various scenarios for creating, finding, updating, deleting people records,
 * and managing related entities in the PeopleService.
 */
describe('PeopleService', () => {
  let service: PeopleService
  let peopleRepository: Repository<People>
  let filmRepository: Repository<Film>
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
        PeopleService,
        {
          provide: getRepositoryToken(People),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            query: jest.fn().mockResolvedValue([{ maxId: 0 }]),
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
      ],
    }).compile()

    service = module.get<PeopleService>(PeopleService)
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
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
      .spyOn(peopleRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the repositories property in the service
      ((service as any).repositories = {
        homeworld: planetRepository,
        films: filmRepository,
        species: speciesRepository,
        starships: starshipRepository,
        vehicles: vehicleRepository,
      })
  })

  /**
   * Test to ensure the PeopleService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of PeopleService.
   */
  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(null)
    })
    /**
     * Test to verify that a new person can be created successfully.
     */
    it('should create a new person', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(peopleRepository, 'save').mockResolvedValue(newPeople)
      jest.spyOn(peopleRepository, 'query').mockResolvedValue([{ maxId: 0 }])
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(newPeople)

      // Setting up mocks for related entities
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)

      const result = await service.create(createPeopleDto)
      expect(result).toEqual(newPeople)
    })

    /**
     * Test to verify that creating a person with an existing name returns null.
     */
    it('should return null if a person with the same name already exists', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(existingPerson)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createPeopleDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `People '${createPeopleDto.name}' already exists!`,
      )

      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(peopleRepository, 'save')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.create(createPeopleDto)).rejects.toThrow(
        'Repository error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of PeopleService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated people.
     */
    it('should return paginated people', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of PeopleService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single person by ID.
     */
    it('should return a single person by ID', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(person)

      expect(await service.findOne(1)).toEqual(person)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of PeopleService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(person)
    })
    /**
     * Test to verify that a person can be updated successfully.
     */
    it('should update a person', async () => {
      jest.spyOn(peopleRepository, 'save').mockResolvedValue(updatedPerson)

      expect(await service.update(1, updatePeopleDto)).toEqual(updatedPerson)
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(peopleRepository, 'save')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.update(1, updatePeopleDto)).rejects.toThrow(
        'Repository error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of PeopleService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(person)
    })
    /**
     * Test to verify that a person can be removed successfully.
     */
    it('should remove a person', async () => {
      jest.spyOn(peopleRepository, 'remove').mockResolvedValue(person)

      expect(await service.remove(1)).toEqual(person)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(peopleRepository, 'remove')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.remove(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of PeopleService.
   */
  describe('fillRelatedEntities', () => {
    const newPeople: People = new People()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(planet)
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
      jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(species)
      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(starship)
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)

      await service['fillRelatedEntities'](newPeople, createPeopleDto)

      expect(newPeople.homeworld).toBeDefined()
      expect(newPeople.homeworld).toEqual(planet)
      expect(newPeople.films).toContainEqual(film)
      expect(newPeople.species).toContainEqual(species)
      expect(newPeople.starships).toContainEqual(starship)
      expect(newPeople.vehicles).toContainEqual(vehicle)
    })

    /**
     * Test to verify that errors in related entity lookups are handled properly.
     */
    it('should handle errors in related entity lookups', async () => {
      jest
        .spyOn(planetRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(
        service['fillRelatedEntities'](newPeople, createPeopleDto),
      ).rejects.toThrow('Repository error')
    })
  })
})

// npm run test -- people.service.spec.ts
