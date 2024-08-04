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
import { SpeciesService } from './species.service'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Species } from 'src/species/entities/species.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/constants'
import { AdminGuard } from 'src/auth/guards/admin.guard'

/**
 * Controller class for managing Species entities
 *
 * This class `SpeciesController` handles incoming HTTP requests related to Species entities.
 * It utilizes various decorators from `@nestjs/common` and `@nestjs/swagger` to define endpoints, handle data,
 * and provide API documentation. It also utilizes services and DTOs for specific functionalities.
 */
@ApiTags('species')
@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  /**
   * POST /species/create endpoint
   *
   * Creates a new Species entity based on the provided data in the request body.
   * Requires admin privileges (protected by AdminGuard).
   *
   * @UseGuards - NestJS decorator to apply the AdminGuard for authorization.
   * @ApiBearerAuth - Requires authorization (bearer token)
   * @Post - NestJS decorator to define a POST endpoint at the specified path.
   * @ApiBody - NestJS Swagger decorator to define the request body schema (CreateSpeciesDto).
   * @ApiOperation - NestJS Swagger decorator to provide a summary and description for the endpoint.
   * @Body - NestJS decorator to access the request body data as a typed object (CreateSpeciesDto).
   * @param createSpeciesDto - The data transfer object containing species creation data.
   * @returns Promise<Species> - A promise resolving to the created Species entity.
   */
  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreateSpeciesDto })
  @ApiOperation({ summary: 'Create new "species"' })
  async create(@Body() createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    return this.speciesService.create(createSpeciesDto)
  }

  /**
   * GET /species endpoint
   *
   * Retrieves all Species entities with pagination options.
   *
   * @Get - NestJS decorator to define a GET endpoint at the specified path.
   * @ApiOperation - NestJS Swagger decorator to provide a summary and description for the endpoint.
   * @ApiQuery - NestJS Swagger decorator to define optional query parameters for pagination (page and limit).
   * @Query - NestJS decorator to access query parameters from the request.
   * @DefaultValuePipe - NestJS pipe to set default values for query parameters if not provided.
   * @param page - Current page number for pagination (defaults to 1).
   * @param limit - Number of items per page (defaults to limitCount utility function).
   * @returns Promise<Pagination<Species>> - A promise resolving to a paginated list of Species entities.
   */
  @Get()
  @ApiOperation({ summary: 'Get all the "species" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Species>> {
    return this.speciesService.findAll({ page, limit })
  }

  /**
   * GET /species/:id endpoint
   *
   * Retrieves a single Species entity by its ID.
   *
   * @Get - NestJS decorator to define a GET endpoint at the specified path with a path parameter.
   * @ApiOperation - NestJS Swagger decorator to provide a summary and description for the endpoint.
   * @Param - NestJS decorator to access path parameters from the request.
   * @param id - The ID of the Species entity to retrieve.
   * @returns Promise<Species> - A promise resolving to the retrieved Species entity.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "species" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Species> {
    return this.speciesService.findOne(id)
  }

  /**
   * PATCH /species/:id endpoint
   *
   * Updates a Species entity with the provided data in the request body.
   * Requires admin privileges (protected by AdminGuard).
   *
   * @UseGuards - NestJS decorator to apply the AdminGuard for authorization.
   * @Patch - NestJS decorator to define a PATCH endpoint at the specified path with a path parameter.
   * @ApiBody - NestJS Swagger decorator to define the request body schema (UpdateSpeciesDto).
   * @ApiOperation - NestJS Swagger decorator to provide a summary and description for the endpoint.
   * @Param - NestJS decorator to access path parameters from the request.
   * @Body - NestJS decorator to access the request body data as a typed object (UpdateSpeciesDto).
   * @param id - The ID of the Species entity to update.
   * @param updateSpeciesDto - The data transfer object containing species update data.
   * @returns Promise<Species> - A promise resolving to the updated Species entity.
   */
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateSpeciesDto })
  @ApiOperation({ summary: 'Update resource "species" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    return this.speciesService.update(id, updateSpeciesDto)
  }

  /**
   * DELETE /species/:id endpoint
   *
   * Deletes a Species entity by its ID.
   * Requires admin privileges (protected by AdminGuard).
   *
   * @UseGuards - NestJS decorator to apply the AdminGuard for authorization.
   * @Delete - NestJS decorator to define a DELETE endpoint at the specified path with a path parameter.
   * @ApiOperation - NestJS Swagger decorator to provide a summary and description for the endpoint.
   * @Param - NestJS decorator to access path parameters from the request.
   * @param id - The ID of the Species entity to delete.
   * @returns Promise<void> - A promise that resolves after the deletion.
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "species" by its "id"' })
  async remove(@Param('id') id: number): Promise<Species> {
    return this.speciesService.remove(id)
  }
}
