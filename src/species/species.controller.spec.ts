import { Test, TestingModule } from '@nestjs/testing'
import { SpeciesController } from './species.controller'
import { SpeciesService } from './species.service'
import { Species } from './entities/species.entity'
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import {
  createSpeciesDto,
  newSpecies,
  paginatedResult,
  species,
  updatedSpecies,
  updatedSpeciesDto,
} from './test-constants'
import { DataSource, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { Planet } from 'src/planets/entities/planet.entity'

/**
 * Unit test suite for SpeciesController.
 * This test suite covers various scenarios for creating, finding, updating, and deleting species records,
 * and authorization checks in the SpeciesController.
 */
describe('SpeciesController', () => {
  let controller: SpeciesController
  let service: SpeciesService

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeciesController],
      providers: [
        SpeciesService,
        {
          provide: getRepositoryToken(Species),
          useValue: {},
        },
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

    controller = module.get<SpeciesController>(SpeciesController)
    service = module.get<SpeciesService>(SpeciesService)
  })

  /**
   * Test to ensure the SpeciesController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of SpeciesController.
   */
  describe('create', () => {
    /**
     * Test to verify that a 403 error is thrown when creating a species without admin rights.
     */
    it('should throw 403 error when creating a species without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createSpeciesDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new species can be created successfully.
     */
    it('should create a new species', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(newSpecies)
      expect(await controller.create(createSpeciesDto)).toEqual(newSpecies)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Service error'))
      await expect(controller.create(createSpeciesDto)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of SpeciesController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated species.
     */
    it('should return a list of species', async () => {
      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of SpeciesController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single species by ID.
     */
    it('should return a single species by ID', async () => {
      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(species)
      expect(await controller.findOne(1)).toEqual(species)
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
   * Test suite for the `update` method of SpeciesController.
   */
  describe('update', () => {
    /**
     * Test to verify that a 403 error is thrown when updating a species without admin rights.
     */
    it('should throw 403 error when updating a species without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatedSpeciesDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a species can be updated successfully.
     */
    it('should update a species', async () => {
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedSpecies)

      expect(await controller.update(1, updatedSpeciesDto)).toEqual(
        updatedSpecies,
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

      await expect(controller.update(1, updatedSpeciesDto)).rejects.toThrow(
        HttpException,
      )
    })
  })

  /**
   * Test suite for the `remove` method of SpeciesController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a species without admin rights.
     */
    it('should throw 403 error when removing a species without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a species can be removed successfully.
     */
    it('should remove a species', async () => {
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

// npm run test -- species.controller.spec.ts
