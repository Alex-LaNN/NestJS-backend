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
import { PlanetsService } from './planets.service'
import { CreatePlanetDto } from './dto/create-planet.dto'
import { UpdatePlanetDto } from './dto/update-planet.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { Planet } from 'src/planets/entities/planet.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

/**
 * PlanetsController
 *
 * This controller handles API requests related to planets. It is decorated
 * with `@ApiTags('planets')` for Swagger documentation and `@Controller('planets')`
 * to define the base path (`/planets`). It injects the `PlanetsService` for
 * interacting with planets and uses various NestJS and `@nestjs/swagger`
 * decorators for routing, request handling, and API documentation.
 */
@ApiTags('planets')
@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  /**
   * Create a new planet
   *
   * This endpoint creates a new planet resource. It is protected with `@UseGuards(AdminGuard)`,
   * requiring admin authorization. It is decorated with `@ApiBearerAuth()` for Swagger
   * to indicate Bearer token authentication and `@ApiBody({ type: CreatePlanetDto })`
   * to describe the expected request body format (CreatePlanetDto). The `@ApiOperation`
   * describes the operation summary.
   *
   * @param createPlanetDto (CreatePlanetDto) The data to create the new planet.
   * @returns Promise<Planet> A promise that resolves to the created Planet entity.
   */
  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreatePlanetDto })
  @ApiOperation({ summary: 'Create new "planet"' })
  async create(@Body() createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetsService.create(createPlanetDto)
  }

  /**
   * Get all planets (paginated)
   *
   * This endpoint retrieves a paginated list of all planet resources. It is decorated
   * with `@Get()` for the GET HTTP method and `@ApiOperation` to describe the
   * operation summary ("Get all the 'planets' resources"). It uses `@ApiQuery`
   * to document optional query parameters for pagination: 'page' (default 1)
   * and 'limit' (default defined in limitCount function). The `findAll` method
   * of `PlanetsService` is called with the extracted page and limit values
   * to retrieve paginated results.
   *
   * @param page (number, optional, default 1) The page number for pagination.
   * @param limit (number, optional, default from limitCount) The number of items per page.
   * @returns Promise<Pagination<Planet>> A promise that resolves to a `Pagination<Planet>` object
   * containing the paginated list of planets and pagination information.
   */
  @Get()
  @ApiOperation({ summary: 'Get all the "planets" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Planet>> {
    if (limit > limitCount) limit = limitCount
    return this.planetsService.findAll({ page, limit })
  }

  /**
   * Get a planet by ID
   *
   * This endpoint retrieves a single planet resource by its ID. It is decorated
   * with `@Get(':id')` for the GET HTTP method with a route parameter `:id`.
   * `@ApiOperation` describes the operation summary ("Get resource 'planet' by its 'id'").
   * The `findOne` method of `PlanetsService` is called with the extracted ID
   * to retrieve the specific planet.
   *
   * @param id (number) The ID of the planet to retrieve.
   * @returns Promise<Planet> A promise that resolves to the retrieved Planet entity.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "planet" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Planet> {
    return await this.planetsService.findOne(id)
  }

  /**
   * Update a planet by ID
   *
   * This endpoint updates a planet resource by its ID. It is protected with
   * `@UseGuards(AdminGuard)`, requiring admin authorization. It is decorated with
   * `@ApiBearerAuth()` for Swagger to indicate Bearer token authentication and
   * `@ApiBody({ type: UpdatePlanetDto })` to describe the expected request body
   * format (UpdatePlanetDto) for partial updates. The `@ApiOperation` describes
   * the operation summary ("Update resource 'planet' by its 'id'").
   *
   * @param id (number) The ID of the planet to update.
   * @param updatePlanetDto (UpdatePlanetDto) The data to update the planet with.
   * @returns Promise<Planet> A promise that resolves to the updated Planet entity.
   */
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePlanetDto })
  @ApiOperation({ summary: 'Update resource "planet" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updatePlanetDto: UpdatePlanetDto,
  ): Promise<Planet> {
    return await this.planetsService.update(id, updatePlanetDto)
  }

  /**
   * Delete a planet by ID
   *
   * This endpoint deletes a planet resource by its ID. It is protected with
   * `@UseGuards(AdminGuard)`, requiring admin authorization. It is decorated with
   * `@ApiBearerAuth()` for Swagger to indicate Bearer token authentication and
   * `@ApiOperation` describes the operation summary ("Delete resource 'planet' by its 'id'").
   *
   * @param id (number) The ID of the planet to delete.
   * @returns Promise<void> A promise that resolves after the planet is deleted.
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "planet" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.planetsService.remove(id)
  }
}
