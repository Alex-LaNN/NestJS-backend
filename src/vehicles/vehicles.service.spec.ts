import { Test, TestingModule } from '@nestjs/testing'
import { VehiclesService } from './vehicles.service'
import { DataSource, Repository } from 'typeorm'
import { Vehicle } from './entities/vehicle.entity'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import {
  createVehicleDto,
  existingVehicle,
  film,
  newVehicle,
  paginatedResult,
  people,
  updatedVehicle,
  updatedVehicleDto,
  vehicle,
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
 * Unit test suite for VehiclesService.
 * This test suite covers various scenarios for creating, finding, updating, deleting vehicle records,
 * and managing related entities in the VehiclesService.
 */
describe('VehiclesService', () => {
  let service: VehiclesService
  let vehicleRepository: Repository<Vehicle>
  let filmRepository: Repository<Film>
  let peopleRepository: Repository<People>

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
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

    service = module.get<VehiclesService>(VehiclesService)
    vehicleRepository = module.get<Repository<Vehicle>>(
      getRepositoryToken(Vehicle),
    )
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film))
    peopleRepository = module.get<Repository<People>>(
      getRepositoryToken(People),
    )

    // Mock implementation for paginate function
    jest
      .spyOn(vehicleRepository, 'findAndCount')
      .mockImplementation(async () => [[], 0]),
      // Define the repositories property in the service
      ((service as any).repositories = {
        pilots: peopleRepository,
        films: filmRepository,
      })
  })

  /**
   * Test to ensure the VehiclesService is defined.
   */
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * Test suite for the `create` method of VehiclesService.
   */
  describe('create', () => {
    /**
     * Test to verify that a new vehicle can be created successfully.
     */
    it('should create a new vehicle', async () => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValueOnce(null)
      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(newVehicle)
      jest.spyOn(vehicleRepository, 'query').mockResolvedValue([{ maxId: 0 }])
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValueOnce(newVehicle)

      // Setting up mocks for related entities
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)

      const result = await service.create(createVehicleDto)
      expect(result).toEqual(newVehicle)
    })

    /**
     * Test to verify that creating a vehicle with an existing name returns null.
     */
    it('should return null if a vehicle with the same name already exists', async () => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(null)
      jest
        .spyOn(vehicleRepository, 'findOne')
        .mockResolvedValue(existingVehicle)

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(await service.create(createVehicleDto)).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `Vehicle '${createVehicleDto.name}' already exists!`,
      )

      consoleErrorSpy.mockRestore()
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on create', async () => {
      jest
        .spyOn(vehicleRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.create(createVehicleDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `findAll` method of VehiclesService.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the `findAll` method returns paginated vehicle.
     */
    it('should return paginated vehicle', async () => {
      jest.mocked(paginate).mockResolvedValue(paginatedResult)

      expect(await service.findAll(paginationOptions)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of VehiclesService.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single vehicle by ID.
     */
    it('should return a single vehicle by ID', async () => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)

      expect(await service.findOne(1)).toEqual(vehicle)
    })

    /**
     * Test to verify that errors in the repository's `findOne` method are handled properly.
     */
    it('should handle repository errors on findOne', async () => {
      jest
        .spyOn(vehicleRepository, 'findOne')
        .mockRejectedValue(new Error('Repository error'))

      await expect(service.findOne(1)).rejects.toThrow('Repository error')
    })
  })

  /**
   * Test suite for the `update` method of VehiclesService.
   */
  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)
    })
    /**
     * Test to verify that a vehicle can be updated successfully.
     */
    it('should update a vehicle', async () => {
      jest.spyOn(vehicleRepository, 'save').mockResolvedValue(updatedVehicle)

      expect(await service.update(1, updatedVehicleDto)).toEqual(updatedVehicle)
    })

    /**
     * Test to verify that errors in the repository's `save` method are handled properly.
     */
    it('should handle repository errors on update', async () => {
      jest
        .spyOn(vehicleRepository, 'save')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.update(1, updatedVehicleDto)).rejects.toThrow(
        'Internal server error',
      )
    })
  })

  /**
   * Test suite for the `remove` method of VehiclesService.
   */
  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(vehicle)
    })
    /**
     * Test to verify that a vehicle can be removed successfully.
     */
    it('should remove a starship', async () => {
      jest.spyOn(vehicleRepository, 'remove').mockResolvedValue(vehicle)

      expect(await service.remove(1)).toEqual(vehicle)
    })

    /**
     * Test to verify that errors in the repository's `remove` method are handled properly.
     */
    it('should handle repository errors on remove', async () => {
      jest
        .spyOn(vehicleRepository, 'remove')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(service.remove(1)).rejects.toThrow('Internal server error')
    })
  })

  /**
   * Test suite for the `fillRelatedEntities` method of VehiclesService.
   */
  describe('fillRelatedEntities', () => {
    const newVehicle: Vehicle = new Vehicle()

    /**
     * Test to verify that related entities are filled correctly.
     */
    it('should fill related entities', async () => {
      jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(people)
      jest.spyOn(filmRepository, 'findOne').mockResolvedValue(film)

      await service['fillRelatedEntities'](newVehicle, createVehicleDto)

      expect(newVehicle.pilots).toContain(people)
      expect(newVehicle.films).toContain(film)
    })

    /**
     * Test to verify that errors in related entity lookups are handled properly.
     */
    it('should handle errors in related entity lookups', async () => {
      jest
        .spyOn(peopleRepository, 'findOne')
        .mockRejectedValue(new Error('Internal server error'))

      await expect(
        service['fillRelatedEntities'](newVehicle, createVehicleDto),
      ).rejects.toThrow('Internal server error')
    })
  })
})

// npm run test -- vehicles.service.spec.ts
