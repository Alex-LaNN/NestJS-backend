import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { AdminGuard } from 'src/auth/guards/admin.guard'

/**
 * VehiclesController
 *
 * This controller handles API requests related to vehicles in the Star Wars universe.
 * It interacts with the `VehiclesService` to perform CRUD (Create, Read, Update, Delete)
 * operations on vehicle data and provides responses in a RESTful API style.
 */
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Create a new vehicle
   *
   * This method (POST /vehicles/create) creates a new vehicle in the system.
   * It requires an Admin role due to the `@UseGuards(AdminGuard)` decorator.
   * The request body should contain a valid `CreateVehicleDto` object.
   * The method uses `@ApiBearerAuth()` for Swagger documentation, indicating Bearer token
   * based authentication, and `@ApiBody()` to describe the expected request body format.
   *
   * @param createVehicleDto Data Transfer Object containing vehicle creation data.
   * @returns The newly created Vehicle entity.
   */
  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreateVehicleDto })
  @ApiOperation({ summary: 'Create new "vehicle"' })
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto)
  }

  /**
   * Get all vehicles (paginated)
   *
   * This method (GET /vehicles) retrieves a paginated list of all vehicles.
   * It uses optional query parameters for `page` and `limit` to control pagination.
   * The method uses `@ApiQuery()` to document these query parameters in Swagger.
   *
   * @param page The current page number (defaults to 1).
   * @param limit The number of vehicles per page (defaults to `limitCount` from utils).
   * @returns A Pagination object containing vehicle data and pagination information.
   */
  @Get()
  @ApiOperation({ summary: 'Get all the "vehicles" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Vehicle>> {
    return this.vehiclesService.findAll({ page, limit })
  }

  /**
   * Find a vehicle by ID
   *
   * This method (GET /vehicles/:id) retrieves a single vehicle by its ID.
   * It uses `@ApiParam()` for Swagger documentation (not available in current version).
   *
   * @param id The ID of the vehicle to retrieve.
   * @returns The Vehicle entity with the matching ID, or undefined if not found.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "vehicle" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Vehicle> {
    return this.vehiclesService.findOne(id)
  }

  /**
   * Update a vehicle
   *
   * This method (PATCH /vehicles/:id) updates an existing vehicle in the system.
   * It requires an Admin role due to the `@UseGuards(AdminGuard)` decorator.
   * The request body should contain a valid `UpdateVehicleDto` object with the updated
   * vehicle information. The URL path parameter `:id` specifies the ID of the vehicle
   * to be updated.
   * The method uses `@ApiBearerAuth()` and `@ApiOperation()` for Swagger documentation.
   *
   * @param id The ID of the vehicle to be updated.
   * @param updateVehicleDto Data Transfer Object containing updated vehicle data.
   * @returns The updated Vehicle entity.
   */
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update resource "vehicle" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto)
  }

  /**
   * Delete a vehicle
   *
   * This method (DELETE /vehicles/:id) deletes a vehicle from the system.
   * It requires an Admin role due to the `@UseGuards(AdminGuard)` decorator.
   * The URL path parameter `:id` specifies the ID of the vehicle to be deleted.
   * The method uses `@ApiBearerAuth()` and `@ApiOperation()` for Swagger documentation.
   *
   * @param id The ID of the vehicle to be deleted.
   * @returns A Promise that resolves to nothing (void) upon successful deletion.
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "vehicle" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.vehiclesService.remove(id)
  }
}
