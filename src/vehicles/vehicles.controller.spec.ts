import { Test, TestingModule } from '@nestjs/testing'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'
import { DataSource, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Vehicle } from './entities/vehicle.entity'
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import {
  createVehicleDto,
  newVehicle,
  paginatedResult,
  updatedVehicle,
  updatedVehicleDto,
  vehicle,
} from './test-constants'

/**
 * Unit test suite for VehiclesController.
 * This test suite covers various scenarios for creating, finding, updating, deleting vehicle records,
 * and authorization checks in the VehiclesController.
 */
describe('VehiclesController', () => {
  let controller: VehiclesController
  let service: VehiclesService

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
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

    controller = module.get<VehiclesController>(VehiclesController)
    service = module.get<VehiclesService>(VehiclesService)
  })

  /**
   * Test to ensure the VehiclesController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of VehiclesController.
   */
  describe('create', () => {
    /**
     * Test to verify that a 403 error is thrown when creating a vehicle without admin rights.
     */
    it('should throw 403 error when creating a vehicle without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createVehicleDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new vehicle can be created successfully.
     */
    it('should create a new vehicle', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(newVehicle)
      expect(await controller.create(createVehicleDto)).toEqual(newVehicle)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Service error'))
      await expect(controller.create(createVehicleDto)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of VehiclesController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated vehicles.
     */
    it('should return a list of vehicles', async () => {
      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of VehiclesController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single vehicle by ID.
     */
    it('should return a single vehicle by ID', async () => {
      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(vehicle)
      expect(await controller.findOne(1)).toEqual(vehicle)
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
   * Test suite for the `update` method of VehiclesController.
   */
  describe('update', () => {
    /**
     * Test to verify that a 403 error is thrown when updating a vehicle without admin rights.
     */
    it('should throw 403 error when updating a vehicle without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatedVehicleDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a vehicle can be updated successfully.
     */
    it('should update a vehicle', async () => {
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedVehicle)

      expect(await controller.update(1, updatedVehicleDto)).toEqual(
        updatedVehicle,
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

      await expect(controller.update(1, updatedVehicleDto)).rejects.toThrow(
        HttpException,
      )
    })
  })

  /**
   * Test suite for the `remove` method of VehiclesController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a vehicle without admin rights.
     */
    it('should throw 403 error when removing a vehicle without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a vehicle can be removed successfully.
     */
    it('should remove a vehicle', async () => {
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

// npm run test -- vehicles.controller.spec.ts
