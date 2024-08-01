import { Test, TestingModule } from '@nestjs/testing'
import { PeopleController } from './people.controller'
import { PeopleService } from './people.service'
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
import {
  createPeopleDto,
  newPeople,
  paginatedResult,
  person,
  updatedPerson,
  updatePeopleDto,
} from './test-constants'

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
      // Mock the service's `create` method
      jest.spyOn(service, 'create').mockResolvedValue(newPeople)

      expect(await controller.create(createPeopleDto)).toEqual(newPeople)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.create(createPeopleDto)).rejects.toThrow(
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

      await expect(controller.findOne(1)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `update` method of PeopleController.
   */
  describe('update', () => {
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
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedPerson)

      expect(await controller.update(1, updatePeopleDto)).toEqual(updatedPerson)
    })

    /**
     * Test to verify that errors in the service's `update` method are handled properly.
     */
    it('should handle service errors on update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Service error'))

      await expect(controller.update(1, updatePeopleDto)).rejects.toThrow(
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

      await expect(controller.remove(1)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })
})

// npm run test -- people.controller.spec.ts
