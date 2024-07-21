import { Test, TestingModule } from '@nestjs/testing'
import { PeopleController } from './people.controller'
import { PeopleService } from './people.service'
import { CreatePeopleDto } from './dto/create-people.dto'
import { UpdatePeopleDto } from './dto/update-people.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { People } from './entities/people.entity'
import { ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'

/**
 * Unit test suite for PeopleController.
 * This test suite covers various scenarios for creating, finding, updating, deleting people records,
 * and authorization checks in the PeopleController.
 */
describe('PeopleController', () => {
  let controller: PeopleController
  let service: PeopleService

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(People),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Film),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Species),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Vehicle),
          useClass: Repository,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<PeopleController>(PeopleController)
    service = module.get<PeopleService>(PeopleService)
  })

  /**
   * Test to ensure the PeopleController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of PeopleController.
   */
  describe('create', () => {
    const createPeopleDto: CreatePeopleDto = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 1,
      films: [],
      species: [],
      vehicles: [],
      starships: [],
    }

    /**
     * Test to verify that a 403 error is thrown when creating a person without admin rights.
     */
    it('should throw 403 error when creating a person without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createPeopleDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new person can be created successfully.
     */
    it('should create a new person', async () => {
      const result = {
        id: 1,
        created: '2014-12-09T13:50:51.644Z',
        edited: '2014-12-20T21:17:56.891Z',
        ...createPeopleDto,
      } as unknown as People

      // Mock the service's `create` method
      jest.spyOn(service, 'create').mockResolvedValue(result)

      expect(await controller.create(createPeopleDto)).toEqual(result)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.create(createPeopleDto)).rejects.toThrowError(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of PeopleController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated people.
     */
    it('should return paginated people', async () => {
      const paginatedResult: Pagination<People> = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      }

      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of PeopleController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single person by ID.
     */
    it('should return a single person by ID', async () => {
      const person = { id: 1, name: 'Luke Skywalker' } as People

      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(person)

      expect(await controller.findOne(1)).toEqual(person)
    })

    /**
     * Test to verify that errors in the service's `findOne` method are handled properly.
     */
    it('should handle service errors on findOne', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.findOne(1)).rejects.toThrowError(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `update` method of PeopleController.
   */
  describe('update', () => {
    const updatePeopleDto: UpdatePeopleDto = {
      name: 'Luke Skywalker Updated',
    }

    /**
     * Test to verify that a 403 error is thrown when updating a person without admin rights.
     */
    it('should throw 403 error when updating a person without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatePeopleDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a person can be updated successfully.
     */
    it('should update a person', async () => {
      const result = { id: 1, name: 'Luke Skywalker Updated' } as People

      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(result)

      expect(await controller.update(1, updatePeopleDto)).toEqual(result)
    })

    /**
     * Test to verify that errors in the service's `update` method are handled properly.
     */
    it('should handle service errors on update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.update(1, updatePeopleDto)).rejects.toThrowError(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `remove` method of PeopleController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a person without admin rights.
     */
    it('should throw 403 error when removing a person without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a person can be removed successfully.
     */
    it('should remove a person', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(null)

      await controller.remove(1)

      expect(service.remove).toHaveBeenCalledWith(1)
    })

    /**
     * Test to verify that errors in the service's `remove` method are handled properly.
     */
    it('should handle service errors on remove', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.remove(1)).rejects.toThrowError(
        new Error('Service error'),
      )
    })
  })
})

// npm run test -- people.controller.spec.ts
