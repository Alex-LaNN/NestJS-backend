import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { People } from 'src/people/entities/people.entity'
import { DataSource, Repository } from 'typeorm'
import { PlanetsController } from './planets.controller'
import { PlanetsService } from './planets.service'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from './entities/planet.entity'
import { Reflector } from '@nestjs/core'
import {
  createPlanetDto,
  newPlanet,
  paginatedResult,
  planet,
  updatedPlanet,
  updatedPlanetDto,
} from './test-constants'

/**
 * Unit test suite for PlanetsController.
 * This test suite covers various scenarios for creating, finding, updating, deleting planet records,
 * and authorization checks in the PlanetsController.
 */
describe('PlanetsController', () => {
  let controller: PlanetsController
  let service: PlanetsService
  let dataSource: DataSource

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [
        PlanetsService,
        {
          provide: getRepositoryToken(Film),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(People),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
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

    controller = module.get<PlanetsController>(PlanetsController)
    service = module.get<PlanetsService>(PlanetsService)
    dataSource = module.get<DataSource>(DataSource)
  })

  /**
   * Test to ensure the PlanetsController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of PlanetsController.
   */
  describe('create', () => {
    /**
     * Test to verify that a 403 error is thrown when creating a planet without admin rights.
     */
    it('should throw 403 error when creating a planet without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createPlanetDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new planet can be created successfully.
     */
    it('should create a new planet', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(newPlanet)
      expect(await controller.create(createPlanetDto)).toEqual(newPlanet)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Service error'))
      await expect(controller.create(createPlanetDto)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of PlanetsController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated planets.
     */
    it('should return a list of planets', async () => {
      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of PlanetsController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single planet by ID.
     */
    it('should return a single planet by ID', async () => {
      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(planet)
      expect(await controller.findOne(1)).toEqual(planet)
      expect(service.findOne).toHaveBeenCalledWith(1)
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
   * Test suite for the `update` method of PlanetsController.
   */
  describe('update', () => {
    /**
     * Test to verify that a 403 error is thrown when updating a film without admin rights.
     */
    it('should throw 403 error when updating a planet without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatedPlanetDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a planet can be updated successfully.
     */
    it('should update a planet', async () => {
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedPlanet)

      expect(await controller.update(1, updatedPlanetDto)).toEqual(
        updatedPlanet,
      )
    })

    /**
     * Test to verify that errors in the service's `update` method are handled properly.
     */
    it('should handle service errors on update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR),
        )

      await expect(controller.update(1, updatedPlanetDto)).rejects.toThrow(
        HttpException,
      )
    })
  })

  /**
   * Test suite for the `remove` method of PlanetsController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a planet without admin rights.
     */
    it('should throw 403 error when removing a planet without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a planet can be removed successfully.
     */
    it('should remove a planet', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(null)

      await controller.remove(1)

      expect(service.remove).toHaveBeenCalledWith(1)
    })

    /**
     * Test to verify that errors in the service's `remove` method are handled properly.
     */
    it('should throw an error when removal fails', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(
          new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR),
        )
      await expect(controller.remove(1)).rejects.toThrow(HttpException)
    })
  })
})

// npm run test -- planets.controller.spec.ts
