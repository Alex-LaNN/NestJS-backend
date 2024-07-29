import { Test, TestingModule } from '@nestjs/testing'
import { FilmsController } from './films.controller'
import { FilmsService } from './films.service'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { Film } from './entities/film.entity'
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { People } from 'src/people/entities/people.entity'
import { DataSource, Repository } from 'typeorm'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Reflector } from '@nestjs/core'
import { createFilmDto, film, newFilm, paginatedResult, updatedFilm, updatedFilmDto } from './test-constants'

/**
 * Unit test suite for FilmsController.
 * This test suite covers various scenarios for creating, finding, updating, deleting film records,
 * and authorization checks in the FylmsController.
 */
describe('FilmsController', () => {
  let controller: FilmsController
  let service: FilmsService
  let dataSource: DataSource

  /**
   * Setup for each test in the suite.
   * This block is executed before each test and is used to set up the testing module and inject dependencies.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
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

    controller = module.get<FilmsController>(FilmsController)
    service = module.get<FilmsService>(FilmsService)
    dataSource = module.get<DataSource>(DataSource)
  })

  /**
   * Test to ensure the FilmsController is defined.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  /**
   * Test suite for the `create` method of FilmsController.
   */
  describe('create', () => {
    /**
     * Test to verify that a 403 error is thrown when creating a film without admin rights.
     */
    it('should throw 403 error when creating a film without admin rights', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.create(createFilmDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a new film can be created successfully.
     */
    it('should create a new film', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(newFilm)
      expect(await controller.create(createFilmDto)).toEqual(newFilm)
    })

    /**
     * Test to verify that errors in the service's `create` method are handled properly.
     */
    it('should handle service errors on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new Error('Service error'))
      await expect(controller.create(createFilmDto)).rejects.toThrow(
        new Error('Service error'),
      )
    })
  })

  /**
   * Test suite for the `findAll` method of FilmsController.
   */
  describe('findAll', () => {
    /**
     * Test to verify that the findAll method returns paginated films.
     */
    it('should return a list of films', async () => {
      // Mock the service's `findAll` method
      jest.spyOn(service, 'findAll').mockResolvedValue(paginatedResult)

      expect(await controller.findAll(1, 10)).toEqual(paginatedResult)
    })
  })

  /**
   * Test suite for the `findOne` method of FilmsController.
   */
  describe('findOne', () => {
    /**
     * Test to verify that the `findOne` method returns a single film by ID.
     */
    it('should return a single film by ID', async () => {
      // Mock the service's `findOne` method
      jest.spyOn(service, 'findOne').mockResolvedValue(film)
      expect(await controller.findOne(1)).toEqual(film)
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
   * Test suite for the `update` method of FilmsController.
   */
  describe('update', () => {
    /**
     * Test to verify that a 403 error is thrown when updating a film without admin rights.
     */
    it('should throw 403 error when updating a film without admin rights', async () => {
      jest.spyOn(service, 'update').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.update(1, updatedFilmDto)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a film can be updated successfully.
     */
    it('should update a film', async () => {
      // Mock the service's update method
      jest.spyOn(service, 'update').mockResolvedValue(updatedFilm)

      expect(await controller.update(1, updatedFilmDto)).toEqual(updatedFilm)
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

      await expect(controller.update(1, updatedFilmDto)).rejects.toThrow(
        HttpException,
      )
    })
  })

  /**
   * Test suite for the `remove` method of FilmsController.
   */
  describe('remove', () => {
    /**
     * Test to verify that a 403 error is thrown when removing a film without admin rights.
     */
    it('should throw 403 error when removing a film without admin rights', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => {
        throw new ForbiddenException('Access denied')
      })

      await expect(controller.remove(1)).rejects.toThrow(
        new ForbiddenException('Access denied'),
      )
    })

    /**
     * Test to verify that a film can be removed successfully.
     */
    it('should remove a film', async () => {
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

// npm run test -- films.controller.spec.ts
