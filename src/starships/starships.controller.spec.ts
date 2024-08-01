import { Test, TestingModule } from '@nestjs/testing'
import { StarshipsController } from './starships.controller'
import { StarshipsService } from './starships.service'
import { DataSource, Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Starship } from './entities/starship.entity'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Film } from 'src/films/entities/film.entity'
import { People } from 'src/people/entities/people.entity'
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import {
  createStarshipDto,
  newStarship,
  paginatedResult,
  starship,
  updatedStarship,
  updatedStarshipDto,
} from './test-constants'

/**
 * Unit test suite for SiarshipsController.
 * This test suite covers various scenarios for creating, finding, updating, deleting starship records,
 * and authorization checks in the SiarshipsController.
 */
describe('StarshipsController', () => {
  let controller: StarshipsController
  let service: StarshipsService
  let dataSource: DataSource

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarshipsController],
      providers: [
        StarshipsService,
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
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

    controller = module.get<StarshipsController>(StarshipsController)
    service = module.get<StarshipsService>(StarshipsService)
    dataSource = module.get<DataSource>(DataSource)
  })

  /**
   * Test to ensure the StarshipsController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of StarshipsController.
   */
  describe('create', () => {
    /**
     * Test to verify that a 403 error is thrown when creating a starship without admin rights.
     */
    it('should throw 403 error when creating a starship without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createStarshipDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new starship can be created successfully.
     */
    it('should create a new starship', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(newStarship)
      expect(await controller.create(createStarshipDto)).toEqual(newStarship)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Service error'))
      await expect(controller.create(createStarshipDto)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of StarshipsController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated starships.
     */
    it('should return a list of starships', async () => {
      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of StarshipsController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single starship by ID.
     */
    it('should return a single starship by ID', async () => {
      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(starship)
      expect(await controller.findOne(1)).toEqual(starship)
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
   * Test suite for the `update` method of StarshipsController.
   */
  describe('update', () => {
    /**
     * Test to verify that a 403 error is thrown when updating a starship without admin rights.
     */
    it('should throw 403 error when updating a starship without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatedStarshipDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a starship can be updated successfully.
     */
    it('should update a starship', async () => {
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedStarship)

      expect(await controller.update(1, updatedStarshipDto)).toEqual(
        updatedStarship,
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

      await expect(controller.update(1, updatedStarshipDto)).rejects.toThrow(
        HttpException,
      )
    })
  })

  /**
   * Test suite for the `remove` method of StarshipsController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a starship without admin rights.
     */
    it('should throw 403 error when removing a starship without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a starship can be removed successfully.
     */
    it('should remove a starship', async () => {
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

// npm run test -- starships.controller.spec.ts
